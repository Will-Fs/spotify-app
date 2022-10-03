import { client_id, redirect_uri } from './secrets';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods';
SpotifyWebApi._addMethods(SpotifyWebApiServer);

export var auth_code;

export const api = new SpotifyWebApi({
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

export const setAuthCode = () => {
    auth_code = getAccessToken();
    return auth_code;
}

export const getAuthorizeURL = () => {

    const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-top-read', 'user-library-read', 'user-follow-read'];
    const state = 'spotify-web-app';
    const authorize_url = api.createAuthorizeURL(
      scopes,
      state,
      false,
      'token'
    );

    return authorize_url;
}