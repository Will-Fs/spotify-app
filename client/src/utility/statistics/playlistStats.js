import { extent, mean, standardDeviation } from 'simple-statistics';

const statsWeCareAbout = [
  'acousticness',
  'danceability',
  // 'duration_ms',
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

export const getPlaylistStats = (tracks) => {
  const rawStats = {};

  tracks.forEach((track) => {
    for (const [key, value] of Object.entries(track)) {
      if (statsWeCareAbout.includes(key)) {
        // console.log(rawStats);
        if (rawStats[key] === undefined) {
          rawStats[key] = [value];
          continue;
        }
        rawStats[key].push(value);
      }
    }
  });

  const stats = {};

  for (const [stat, list] of Object.entries(rawStats)) {
    const avg = mean(list);
    const stdDev = standardDeviation(list);
    const minMax = extent(list);
    stats[stat] = {
      avg,
      minMax: minMax.map((number) => tracks[list.indexOf(number)]),
      standardDeviation: stdDev,
      relativeStandardDeviation: stdDev / avg,
    };
  }
  return stats;
  // console.log(stats);
};
