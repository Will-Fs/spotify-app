import { api } from '../../spotifyAuth';

const statsWeCareAbout = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  // 'loudness',
  // 'mode',
  'speechiness',
  // 'tempo',
  // 'time_signature',
  'valence',
];

export const getTrackFeaturesRaw = async (id) => {
  const d = await api.getAudioFeaturesForTrack(id);
  const data = d.body;

  return data;
};

export const getTrackFeatures = async (id) => {
  const data = await getTrackFeaturesRaw(id);
  const features = {};

  for (const [key, value] of Object.entries(data)) {
    if (statsWeCareAbout.includes(key)) {
      features[key] = value;
    }
  }

  return features;
};

export const getTrackAnalysisRaw = async (id) => {
  const d = await api.getAudioAnalysisForTrack(id);
  const data = d.body;
};
