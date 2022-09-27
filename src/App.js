import './App.css';
import { client_id } from './secrets';
import ReactDOM from 'react-dom/client';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';
import { FastAverageColor } from 'fast-average-color';
SpotifyWebApi._addMethods(SpotifyWebApiServer);

const redirect_uri = "http://localhost:3000/";
var auth_code;

const fac = new FastAverageColor();
const api = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri
});

const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-top-read', 'user-library-read', 'user-follow-read'];
const state = 'spotify-web-app';
const authorize_url = api.createAuthorizeURL(
  scopes, 
  state,
  true,
  'token'
);

const getAccessToken = () => {
  const hash = window.location.hash.substring(1);

  const result = hash.split('&').reduce(function (res, item) {
      var parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
  }, {});
  return result.access_token;
}

export const displayUserInfo = () => {
  if (!api.getAccessToken()) {
    console.log(api.getAccessToken());
    return;
  }
  const _displayUserInfo = (profileInfo, playlistData) => {
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
    console.log(profileInfo);

    const content_container = document.querySelector(".content-container");
    const root = ReactDOM.createRoot(content_container);
    const pfpUrl = profileInfo.images[0].url;
    fac.getColorAsync(pfpUrl)
      .then(color => {
        return getColorInfo(color);
    })
    .then(pfpColors => {

        const content = 
        <div className = "user-info">
          <div className="profile" style={{backgroundImage: `linear-gradient(to top, ${pfpColors.bottomColor}, ${pfpColors.topColor}`, filter: "saturate(2)"}}>
            <img id='display-img' src={pfpUrl ? pfpUrl : ""} alt="Spotify Profile" style={{filter: "saturate(0.5)"}}></img>
            <h1 id='name' style={{color: pfpColors.foregroundColor}}>{profileInfo.display_name}</h1>
            <div className="profile-stats">
              <p id="follower-count" style={{color: pfpColors.foregroundColor}}>{profileInfo.followers.total} Followers</p>
              <p id="public-playlist-count" style={{color: pfpColors.foregroundColor}}>{playlistData.numPublicPlaylists} Public Playlists</p>
            </div>
          </div>
          <div className='top-artist'>

          </div>
        </div>;

        root.render(content);
      })
  }

  let userData, playlistData;

  api
    .getMe()
    .then(data => {
      userData = data.body;
      return api.getUserPlaylists(userData.id, {limit: '50'});
    })
    .then(data => {
      const publicPlaylists = data.body.items.filter(playlist => playlist.public);
      console.log(data.body);

      playlistData = {
        publicPlaylists: publicPlaylists,
        numPublicPlaylists: publicPlaylists.length
      };
      return api.getMyTopArtists({ time_range: "short_term" });
    })
    .then (data => {
      console.log(data);
      _displayUserInfo(userData, playlistData);
    })
    .catch(err => {
      console.log(`Something went wrong: ${err}`);
    })
}

function App() {
  const getAuthCode = () => {
    auth_code = getAccessToken();
    if (auth_code !== null) {
      api.setAccessToken(auth_code);
    }
    return auth_code;
  }

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
