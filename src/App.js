import './App.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import {api, auth_code, setAuthCode, getAuthorizeURL} from "./spotify"
import { renderMe } from './components/mainObjects/MeObject';
//import { InfoCard } from './components/InfoCard';

export const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const displayUserInfo = () => {
  if (!api.getAccessToken()) {
    console.error("Could not retrieve API Access Token!");

    return;
  }
  const content_container = document.querySelector(".content-container");
  const root = ReactDOM.createRoot(content_container);

  renderMe(root);
}

function App() {
  const getAuthCode = () => {
    setAuthCode();
    console.log(`Auth Code: ${auth_code ?? "Not found!"}`)
    if (auth_code !== null) {
      // sessionStorage.setItem("willfs-spotify-auth-code", auth_code);
      console.log("Setting Access Token.")
      api.setAccessToken(auth_code);
      console.log(`Get Access Token: ${api.getAccessToken()}`);
      // window.history.pushState({}, null, "/");
    }
    return auth_code;
  }

  const handleLogin = () => {
    window.location = getAuthorizeURL();
  }

  return (
    <div className='container'>
      {getAuthCode() ? <div className="content-container"></div> : <button onClick={handleLogin}>Login to Spotify</button>}
    </div>
  );
}

export default App;
