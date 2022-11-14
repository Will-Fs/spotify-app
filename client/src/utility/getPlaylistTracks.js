import { api } from '../spotifyAuth';
import { getTrackFeaturesRaw } from './trackInfo/trackAnalysis';

export const calcLength = (tracks) => {
  let totalTime = 0;

  tracks.forEach((track) => {
    if (track.track) totalTime += track.track.duration_ms;
  });

  totalTime = Math.round(totalTime / 1000) / 3600;
  if (totalTime > 10) return `about ${Math.round(totalTime)} hr`;

  const hours = Math.floor(totalTime);
  const minutes = Math.round((totalTime - hours) * 60);

  return `${hours} hr ${minutes} min`;
};

export const getAllFeatures = async (tracks) => {
  const promises = [];
  tracks.forEach((track) => {
    // console.log(track);
    promises.push(getTrackFeaturesRaw(track.track.id));
  });

  return Promise.allSettled(promises).then((features) => {
    return features.map((feature) => feature.value);
  });
};

export const getAllPlaylistTracks = async (id) => {
  let allTracks = [];
  const numTracks = (await api.getPlaylistTracks(id, { limit: 1 })).body.total;
  const numBatches = Math.ceil(numTracks / 100);

  const promises = [];
  for (let i = 0; i < numBatches; i++) {
    promises.push(api.getPlaylistTracks(id, { limit: 100, offset: i * 100 }));
  }

  const batches = await Promise.allSettled(promises);

  batches.forEach((batch) => {
    allTracks.push(...batch.value.body.items);
  });

  return allTracks;
};

export const getTracksFromIds = async (ids) => {
  const promises = [];

  ids.forEach((id) => {
    promises.push(api.getTrack(id));
  });

  return Promise.allSettled(promises).then((tracks) => {
    return tracks.map((track) => track.value);
  });
};
