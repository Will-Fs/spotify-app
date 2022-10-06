import './App.css';
import React from 'react';
import {api, auth_code, setCodes, getAuthorizeURL} from "./spotify"
import { renderMe } from './components/mainObjects/MeObject';

export const formatter = Intl.NumberFormat("en", { notation: 'compact' });

const GetMeInfo = async () => {
  return renderMe()
    .then(content => {
      return <div className="content-container">{content}</div>;
    })
}

const displayObject = async () => {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      return GetMeInfo();
    case '/playlist':
      return <h1>WIP!</h1>
    default:
      return GetMeInfo();
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