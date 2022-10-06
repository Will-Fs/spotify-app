import { client_id, redirect_uri } from './secrets';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';
import axios from 'axios';
SpotifyWebApi._addMethods(SpotifyWebApiServer);

export var auth_code;
export var refresh_token;

export const api = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri
});

const getAccessTokens = () => {
  const hash = window.location.hash.substring(1);

  const result = hash.split('&').reduce(function (res, item) {
    var parts = item.split('=');
    res[parts[0]] = parts[1];
    return res;
  }, {});


  return {access_token: result.access_token, refresh_token: result.refresh_token};
}

const getCode = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.code;
}

export const setCodes = async () => {
/*
  const codes = getAccessTokens();
  
  auth_code = codes.access_token;
  refresh_token = codes.refresh_token;

  api.setAccessToken(auth_code);
  api.setAccessToken(refresh_token);
*/
  const code = getCode();
  let codeGrantData;
  if (code !== null) {
    const loginLocation = `${window.location.protocol}//${window.location.hostname}:3001/login`;
    codeGrantData = await axios.post(loginLocation, {
      code,
    }).then(res => {
      return res.data
    }, err => {
      console.log(`${err.statusCode} Error: ${err.message}`);
      return false;      
    });
  }

  if (codeGrantData) {
    api.setAccessToken(codeGrantData.access_token);
    api.setRefreshToken(codeGrantData.refresh_token);
    sessionStorage.setItem("willfs-spotify-access-tokens", 
      JSON.stringify({
        access_token: codeGrantData.access_token, 
        refresh_token: codeGrantData.refresh_token
    }));
    return true
  }
  else{
    const tokens = sessionStorage.getItem("willfs-spotify-access-tokens");
    if (!tokens)
      return false;
    const {access_token, refresh_token} = JSON.parse(tokens);
    if (access_token) {
      api.setRefreshToken(refresh_token);
      return api.refreshAccessToken()
        .then(data => {
            console.log("Refreshed Token!");
            api.setAccessToken(data.body.access_token);
            sessionStorage.setItem("willfs-spotify-access-tokens", 
              JSON.stringify({
                access_token: data.body.access_token, 
                refresh_token: refresh_token
            }));
            return true;
          }          
        , err => {
          sessionStorage.removeItem("willfs-spotify-access-tokens");
          console.log("Error Refreshing!");
          console.log({err});
          return false
        })
    }
  }
}

export const getAuthorizeURL = () => {

    const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-top-read', 'user-library-read', 'user-follow-read'];
    const state = 'spotify-web-app';
    const authorize_url = api.createAuthorizeURL(
      scopes,
      state,
      false,
      'code'
    );

    return authorize_url;
}