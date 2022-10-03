import './App.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import {api, auth_code, setAuthCode, getAuthorizeURL} from "./spotify"
import { renderMe } from './components/mainObjects/MeObject';
//import { InfoCard } from './components/InfoCard';

export const formatter = Intl.NumberFormat("en", { notation: 'compact' });



const displayUserInfo = async () => {
  /*
  if (!api.getAccessToken()) {
    console.error("Could not retrieve API Access Token!");

    return;
  }
  */
  return renderMe()
    .then(content => {
      return <div className="content-container">{content}</div>;
    })
}

const GetApp = async () => {
  const getAuthCode = () => {
    setAuthCode();
    console.log(`Auth Code: ${auth_code ?? "Not found!"}`)
    if (auth_code) {
      console.log("Setting Access Token.")
      api.setAccessToken(auth_code);
      console.log(`Get Access Token: ${api.getAccessToken()}`);
    }
    return auth_code;
  }

  const handleLogin = () => {
    window.location = getAuthorizeURL();
  }

  if (!getAuthCode())
    return <button onClick={handleLogin}>Login to Spotify</button>;
  else {
    return (
      displayUserInfo()
        .then (content => {
          return content;
        })
      );
  }


}

export default GetApp;