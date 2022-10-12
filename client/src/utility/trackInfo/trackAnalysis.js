import { api } from "../../spotifyAuth";

export const getTrackFeaturesRaw = async id => {
    const d = await api.getAudioFeaturesForTrack(id);
    const data = d.body;

    return data;
}

export const getTrackAnalysisRaw = async id => {
    const d = await api.getAudioAnalysisForTrack(id);
    const data = d.body;
    console.log(data);
}