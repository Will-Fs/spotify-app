import { api } from '../../spotifyAuth';

const catchPlaybackErr = (err) => {
  const code = err.statusCode;
  if (code === 404) console.log('No active device!');
};

export const setVolume = async (volume) => {
  volume = Math.max(Math.min(volume, 100), 0);
  api.setVolume(volume).catch(catchPlaybackErr);
};

export const playTrack = async (id) => {
  const uri = `spotify:track:${id}`;
  api.play({ uris: [uri] }).catch(catchPlaybackErr);
};

export const addTrackToQueue = async (id) => {
  const uri = `spotify:track:${id}`;
  await api.addToQueue(uri).catch(catchPlaybackErr);
};
