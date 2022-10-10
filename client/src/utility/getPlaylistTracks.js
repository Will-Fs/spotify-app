import { api } from "../spotifyAuth";

export const calcLength = (tracks) => {
    let totalTime = 0;
    tracks.forEach(track => {
        totalTime += track.track.duration_ms;
    })
    
    totalTime = Math.round(totalTime / 1000) / 3600;
    if (totalTime > 10)
        return `about ${ Math.round(totalTime)} hr`;

    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);

    return `${hours} hr ${minutes} min`
}

export const getAllPlaylistTracks = async (id) => {
    let allTracks = [];

    const getTracks = async offset => {
        const d = await api.getPlaylistTracks(id, {limit: 100, offset: offset});
        const data = d.body
        allTracks.push(...data.items);

        if (data.next) {
            await getTracks(offset + 100);
        }
    }


    const d = await api.getPlaylistTracks(id);
    await getTracks(0);
    return allTracks;
}