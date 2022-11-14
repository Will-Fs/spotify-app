import './styles/app.css';

import React from 'react';
import { api, auth_code, setCodes, getAuthorizeURL } from './spotifyAuth';
import { MePage } from './components/pages/MePage';
import { PlaylistPage } from './components/pages/PlaylistPage';
import { TrackPage } from './components/pages/TrackPage';
import {
  getActiveDevice,
  getDevices,
  setActiveDevice,
} from './utility/playback/devices';
import {
  addTrackToQueue,
  playTrack,
  volumeTest,
} from './utility/playback/setPlayback';

export const formatter = Intl.NumberFormat('en', { notation: 'compact' });

const GetMePage = async () => {
  return MePage().then((content) => {
    return <main>{content}</main>;
  });
};

const PlaylistInfo = async () => {
  const id = new URLSearchParams(document.location.search).get('id');
  return PlaylistPage(id).then((content) => {
    return <main>{content}</main>;
  });
};

const TrackInfo = async () => {
  const id = new URLSearchParams(document.location.search).get('id');
  return TrackPage(id).then((content) => {
    return <main>{content}</main>;
  });
};

const displayObject = async () => {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      return GetMePage();
    case '/me':
      return GetMePage();
    case '/playlist':
      return PlaylistInfo();
    case '/track':
      return TrackInfo();
    default:
      return <h1>Page not found: {path}</h1>;
  }
};

const runTests = async () => {
  // getDevices();
  // getActiveDevice();
  // await setActiveDevice("c04d0e7707c6c9e6fa842445236691ae2ff7517b");
  // await playTrack('1tdltVUBkiBCW1C3yB4zyD');
  // addTrackToQueue('3Am0IbOxmvlSXro7N5iSfZ');
};

const GetApp = async (root) => {
  root.render(
    <React.StrictMode>
      <div className="temp-container">
        <h1>Getting your information...</h1>
      </div>
    </React.StrictMode>
  );

  const handleLogin = () => {
    window.location = getAuthorizeURL();
  };

  return setCodes().then((resp) => {
    if (resp === false) {
      root.render(
        <React.StrictMode>
          <div className="temp-container">
            <h1>Loading Button...</h1>
          </div>
        </React.StrictMode>
      );
      return (
        <div className="login-button-container">
          <button id="login-button" onClick={handleLogin}>
            Login with Spotify
          </button>
        </div>
      );
    } else {
      runTests();
      root.render(
        <React.StrictMode>
          <div className="temp-container">
            <h1>Getting data...</h1>
          </div>
        </React.StrictMode>
      );
      return displayObject().then((content) => {
        if (
          window.location.pathname === '/' ||
          window.location.pathname === `/me`
        )
          window.history.pushState({}, '', window.location.pathname);
        return content;
      });
    }
  });
};

export default GetApp;
