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

const GetApp = async (root) => {
  root.render(
    <React.StrictMode>
      <div className='temp-container'>
        <h1>Getting your information...</h1> 
      </div>
    </React.StrictMode>
  );
  const getAuthCode = () => {
    root.render(
      <React.StrictMode>
        <div className='temp-container'>
          <h1>Getting access token...</h1> 
        </div>
      </React.StrictMode>
    );
    setAuthCode();
    console.log(`Auth Code: ${auth_code ?? "Not found!"}`);
    if (auth_code) {
      console.log("Setting Access Token.")
      api.setAccessToken(auth_code);
      console.log(`Get Access Token: ${api.getAccessToken()}`);
      root.render(
        <React.StrictMode>
          <div className='temp-container'>
            <h1>Got access token...</h1> 
          </div>
        </React.StrictMode>
      );
    }
    return auth_code;
  }

  const handleLogin = () => {
    window.location = getAuthorizeURL();
  }

  if (!getAuthCode())
    return (
    <div className='login-button-container'>
      <button id="login-button" onClick={handleLogin}>Login with Spotify</button>
    </div>
    )
  else {
    root.render(
      <React.StrictMode>
        <div className='temp-container'>
          <h1>Getting your data...</h1> 
        </div>
      </React.StrictMode>
    );
    return (
      displayUserInfo()
        .then (content => {
          return content;
        })
      );
  }


}

export default GetApp;