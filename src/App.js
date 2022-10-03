import './App.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import {InfoCard} from "./components/InfoCard"
import {api, auth_code, setAuthCode, getAuthorizeURL} from "./spotify"
import { NewInfoCard } from './components/InfoCard';

export const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const displayUserInfo = () => {
  if (!api.getAccessToken()) {
    console.log("Could not retrieve API Access Token!");
    console.log(`Auth Code: ${auth_code}`);

    return;
  }
  const _displayUserInfo = (topArtist, topTrack) => {
    const content_container = document.querySelector(".content-container");
    const root = ReactDOM.createRoot(content_container);

    const content = (
      <div className="user-info">
        <InfoCard type={"me"} id="" />
        <NewInfoCard type="artist" id={topArtist.id} isTopArtist={true} timeFrame={"short"}></NewInfoCard>
        <NewInfoCard type="track" id={topTrack.id} isTopTrack={true} timeFrame={"short"}></NewInfoCard>
        {/* <InfoCard type={"artist"} id={topArtist.id} additionalData={{type: "top_artist", time_frame: "short"}} /> */}
        {/* <InfoCard type={"track"} id={topTrack.id} additionalData={{type: "top_track", time_frame: "short"}}/> */}
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

function App() {
  const getAuthCode = () => {
    setAuthCode();
    console.log(`Auth Code: ${auth_code}`)
    if (auth_code !== null) {
      // sessionStorage.setItem("willfs-spotify-auth-code", auth_code);
      api.setAccessToken(auth_code);
      // window.history.pushState({}, null, "/");
    }
    return auth_code;
  }


  const handleLogin = () => {
    window.location = getAuthorizeURL();
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
