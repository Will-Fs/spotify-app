import './App.css';
import React from 'react';
import {api, auth_code, setCodes, getAuthorizeURL} from "./spotify"
import { MePage } from './components/pages/MePage';
// import {}

export const formatter = Intl.NumberFormat("en", { notation: 'compact' });

const GetMePage = async () => {
  return MePage()
    .then(content => {
      return <div className="content-container">{content}</div>;
    })
}

const PlaylistInfo = async () => {
  const id = new URLSearchParams(document.location.search).get("id");
  console.log(id);
  return <h1>WIP!</h1>
}

const displayObject = async () => {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      return GetMePage();
    case '/me':
      return GetMePage();
    case '/playlist':
      return PlaylistInfo();
    default:
      return <h1>Page not found: {path}</h1>
  }
}

const GetApp = async (root) => {
  root.render(
    <React.StrictMode>
      <div className='temp-container'>
        <h1>Getting your information...</h1> 
      </div>
    </React.StrictMode>
  );

  const handleLogin = () => {
    window.location = getAuthorizeURL();
  }

  return setCodes().then(resp => {
    if (resp === false) {
      root.render(
        <React.StrictMode>
          <div className='temp-container'>
            <h1>Loading Button...</h1> 
          </div>
        </React.StrictMode>
      )
      return (
        <div className='login-button-container'>
          <button id="login-button" onClick={handleLogin}>Login with Spotify</button>
        </div>
      )
    }
    else {
      root.render(
        <React.StrictMode>
          <div className='temp-container'>
            <h1>Getting your data...</h1> 
          </div>
        </React.StrictMode>
      );
      return (
        displayObject()
          .then (content => {
            window.history.pushState({}, '', window.location.pathname);
            return content;
          })
        );
    }
  })


}

export default GetApp;