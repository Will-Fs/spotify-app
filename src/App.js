import './App.css';
import { client_id, redirect_uri } from './secrets';
import ReactDOM from 'react-dom/client';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';
import { FastAverageColor } from 'fast-average-color';
import React, { useEffect, useState } from 'react';
import {setImageSize} from "./imageSize";


SpotifyWebApi._addMethods(SpotifyWebApiServer);

const formatter = Intl.NumberFormat("en", { notation: 'compact' });
var auth_code;

const fac = new FastAverageColor();
const api = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri
});

const getAccessToken = () => {
  const hash = window.location.hash.substring(1);

  const result = hash.split('&').reduce(function (res, item) {
    var parts = item.split('=');
    res[parts[0]] = parts[1];
    return res;
  }, {});
  return result.access_token;
}

const getColorInfo = color => {
  const bgColorMult = 0.3;
  const avgColor = color.value.slice(0, 3).reduce((a, b) => a + b) / 3;
  return (
    {
      foregroundColor: avgColor > 120 ? "black" : "white",
      bgColorMult: bgColorMult,
      topColor: `rgb(${color.value.map(color => color * (1 + bgColorMult * 2)).join(", ")})`,
      bottomColor: `rgb(${color.value.map(color => color * (1 - bgColorMult / 3)).join(", ")})`,
      bgTopColor: `rgb(${color.value.map(color => (color * 130/avgColor) ** 1.1).join(", ")})`
    }
  );
}

export const displayUserInfo = () => {
  if (!api.getAccessToken()) {
    console.log(getAccessToken());

    return;
  }
  const _displayUserInfo = (topArtist, topTrack) => {
    const content_container = document.querySelector(".content-container");
    const root = ReactDOM.createRoot(content_container);

    const content = (
      <div className="user-info">
        <InfoCard type={"me"} id="" />
        <InfoCard type={"artist"} id={topArtist.id} additionalData={{type: "top_artist", time_frame: "short"}} />
        <InfoCard type={"track"} id={topTrack.id} additionalData={{type: "top_track", time_frame: "short"}}/>
      </div>
    )
    root.render(content);
  }

  let topArtist;

  api
    .getMyTopArtists({ time_range: "short_term" })
      .then(data => {
        topArtist = data.body.items[0];
        return api.getMyTopTracks({time_range: "short_term"});
      })
      .then(data => {
        const topTrack = data.body.items[0];
        _displayUserInfo(topArtist, topTrack);
      })

}

const getCardData = async (type, id) => {
  let targetData = {};
  let additionalData = {};

  const _getColorData = async () => {
    return fac.getColorAsync(targetData.images[0].url);
  }

  const _getUserPlaylistData = async () => {
    return api.getUserPlaylists(id, { limit: '50' });
  }

  const _getTargetData = async () => {
    if (type === "me") {
      return api.getMe();
    }
    if (type === "user") {
      return api.getUser(id);
    }
    if (type === "artist") {
      return api.getArtist(id);
    }
    if (type === "playlist") {
      return api.getPlaylist(id);
    }
    if (type === "track") {
      return api.getTrack(id);
    }
  }

  const _targetData = await _getTargetData();
  targetData = _targetData.body;
  if (type === "track")
    targetData.images = targetData.album.images;

  const colorData = await _getColorData();

  if (type === "user" || type === "me") {
    if (type === "me") {
      id = targetData.id;
    }
    const playlistData = await _getUserPlaylistData();
    const publicPlaylists = playlistData.body.items.filter(playlist => playlist.public);
    additionalData.playlistData = {
      publicPlaylists: publicPlaylists,
      numPublicPlaylists: publicPlaylists.length,
      playlists: playlistData.body.items,
      numPlaylists: playlistData.body.items.length
    };
  }

  additionalData.colorData = getColorInfo(colorData);

  return { targetData: targetData, additionalData: additionalData };
}

export function InfoCard(props) {
  const type = props.type;
  const id = props.id;

  const ActualInfoCard = (_props) => {
    const data = _props.data;
    const color = data.additionalData.colorData;
    const targetData = data.targetData;
    const name = (type === "artist" || type === "track") ? targetData.name : (type === "user" || type === "me") ? targetData.display_name : "PLACEHOLDER";
    const imgURL = targetData.images[0].url;
    const foregroundColor = type === "me" ? "var(--body-foreground-color)" : color.foregroundColor;

    let firstLabel = "Unknown";
    let secondLabel = "Unknown";
    if (type === "user" || type === "me") {
      
      firstLabel = `${formatter.format(targetData.followers.total)} Followers • ${data.additionalData.playlistData.numPublicPlaylists} Public Playlists`;
      // secondLabel = `${data.additionalData.playlistData.numPublicPlaylists} Public Playlists`;
    }
    else if (type === "artist") {
      firstLabel = `${formatter.format(targetData.followers.total)} Followers`;
      secondLabel = "Artist";
    }
    else if (type === "playlist") {
      console.log(data);
    }
    else if (type === "track") {
      firstLabel = targetData.artists[0].name;
      secondLabel = "Track"
    }

    const additionalInfoType = props.additionalData?.type;

    const needsCardTitle = ["top_track", "top_artist"].includes(additionalInfoType);
    const needsSecondaryLabel = !needsCardTitle && type !== "me";
    const cardTitleText = 
      additionalInfoType === "top_track" ? "Top track this month" : 
      additionalInfoType === "top_artist" ? "Top artist this month" : 
      "Placeholder";
    let cardTitle = null;
    if (needsCardTitle)
      cardTitle = <h2 className="card-title" style={{ color: foregroundColor }}>{cardTitleText}</h2>;

    const cardStyle = type !== "me" ? 
    { backgroundImage: `linear-gradient(to top, ${color.bottomColor}, ${color.topColor}`, filter: "saturate(2)" } : null;

    if (type === "me") {
      const root = document.documentElement;
      root.style.setProperty("--user-info-bg-color", color.bgTopColor);
    }


    return (
      <div className={`card-large ${type === "me" ? "card-me" : ""}`} style={cardStyle}>
        {cardTitle}
        <img onLoad = {setImageSize} id='profile-img' src={imgURL} alt={`Spotify Info Card of type ${type}`} style={type !== "me" ? { filter: "saturate(0.5)" } : null}></img>
        <div className="profile-stats">
          <h1 id='name' style={{ color: foregroundColor }}>{name}</h1>
          <h2 className="first-card-label " style={{ color: foregroundColor }}>{firstLabel}</h2>
          {needsSecondaryLabel ? <p className="second-card-label" style={{ color: foregroundColor }}>{secondLabel}</p> : null}
        </div>
      </div>
    );
  }

  const [data, updateData] = useState();
  useEffect(() => {
    const getData = async () => {
      if (data)
        return;
      const resp = await getCardData(type, id);
      updateData(resp);
    }
    getData();
  });

  return data && <ActualInfoCard data={data} />;
}

function App() {
  const getAuthCode = () => {
    auth_code = getAccessToken();
    console.log(`Auth Code: ${auth_code}`)
    sessionStorage.removeItem("willfs-spotify-auth-code");
    if (auth_code !== null) {
      // sessionStorage.setItem("willfs-spotify-auth-code", auth_code);
      api.setAccessToken(auth_code);
      // window.history.pushState({}, null, "/");
    }
    return auth_code;
  }

  const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-top-read', 'user-library-read', 'user-follow-read'];
  const state = 'spotify-web-app';
  const authorize_url = api.createAuthorizeURL(
    scopes,
    state,
    false,
    'token'
  );

  const handleLogin = () => {
    window.location = authorize_url;
  }

  let content;

  if (getAuthCode()) {
    content = <div className="content-container"></div>;
  }
  else {
    content = <button onClick={handleLogin}>Login to Spotify</button>
  }

  return (
    <div className='container'>
      {content}
    </div>
  );
}

export default App;
