import './App.css';
import { client_id } from './secrets';
import ReactDOM from 'react-dom/client';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';
import { FastAverageColor } from 'fast-average-color';
import React, { useEffect, useState } from 'react';

SpotifyWebApi._addMethods(SpotifyWebApiServer);

const redirect_uri = "http://localhost:3000/";
const formatter = Intl.NumberFormat("en", {notation: 'compact'});
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
  const bgColorMult = 0.3
  return (
  {
    foregroundColor: "white",
    bgColorMult: bgColorMult,
    topColor: `rgb(${color.value.map(color => color * (1 + bgColorMult * 2)).join(", ")})`,
    bottomColor: `rgb(${color.value.map(color => color * (1 - bgColorMult/3)).join(", ")})`
  }
  );
}

export const displayUserInfo = () => {
  if (!api.getAccessToken()) {
    console.log(api.getAccessToken());
    return;
  }
  const _displayUserInfo = topArtist => {
    const content_container = document.querySelector(".content-container");
    const root = ReactDOM.createRoot(content_container);
  
    const content = (
      <div className = "user-info">
        <InfoCard type={"me"} id="" />
        <InfoCard type={"artist"} id={topArtist.id} additionalData="top_artist"/>
      </div>
    )
    root.render(content);
  }

  api
    .getMyTopArtists({ time_range: "short_term" })
      .then(data => {
        _displayUserInfo(data.body.items[0]);
      })
}

const getCardData = async (type, id) => {
  let targetData = {}
  let additionalData = {};

  const _getColorData = async () => {
    return fac.getColorAsync(targetData.images[0].url);
  }

  const _getUserPlaylistData = async() => {
    return api.getUserPlaylists(id, {limit: '50'});
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
  }

  const _targetData = await _getTargetData();
  targetData = _targetData.body;

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

  return {targetData: targetData, additionalData: additionalData};
}

export function InfoCard(props) {
  const type = props.type;
  const id = props.id;

  const ActualInfoCard = (_props) => {
    const data = _props.data;
    const color = data.additionalData.colorData;
    const targetData = data.targetData;
    const name = type==="artist"?targetData.name:(type==="user" || type==="me")?targetData.display_name:"PLAYLIST PLACEHOLDER";
    const imgURL = targetData.images[0].url;

    let firstLabel = "Unknown";
    let secondLabel = "Unknown";
    if (type === "user" || type === "me") {
      firstLabel = `${formatter.format(targetData.followers.total)} Followers`;
    } 
    else if (type === "artist") {
      firstLabel = props.additionalData ===  "top_artist"?"Top artist this month":"Artist";
    }
    if (type === "user" || type === "me") {
      secondLabel = `${data.additionalData.playlistData.numPublicPlaylists} Public Playlists`;
    } 
    else if (type === "artist") {
      secondLabel = `${formatter.format(targetData.followers.total)} Followers`;
    }

    return (
    <div className="profile" style={{backgroundImage: `linear-gradient(to top, ${color.bottomColor}, ${color.topColor}`, filter: "saturate(2)"}}>
      <img id='profile-img' src={imgURL} alt={`Spotify Info Card of type ${type}`} style={{filter: "saturate(0.5)"}}></img>
      <h1 id='name' style={{color: color.foregroundColor}}>{name}</h1>
      <div className="profile-stats">
        <p id="first-card-label" style={{color: color.foregroundColor}}>{firstLabel}</p>
        <p id="second-card-label" style={{color: color.foregroundColor}}>{secondLabel}</p>
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
    if (auth_code !== null) {
      api.setAccessToken(auth_code);
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
      <h1 className="title">Spotify Web App</h1>
      {content}
    </div>
  );
}

export default App;
