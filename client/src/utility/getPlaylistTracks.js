import { api } from "../spotifyAuth";

export const calcLength = (tracks) => {
    let totalTime = 0;

    tracks.forEach(track => {
        if (track.track)
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
    const numTracks = (await api.getPlaylistTracks(id, {limit: 1})).body.total;
    const numBatches = Math.ceil(numTracks / 100);
    
    const promises = [];
    for (let i = 0; i < numBatches; i++) {
        promises.push(api.getPlaylistTracks(id, {limit: 100, offset: i*100}));
    }

    const batches = await Promise.allSettled(promises);

    batches.forEach(batch => {
        allTracks.push(...batch.value.body.items);
    })
    // const getTracks = async offset => {
    //     const d = await 
    //     const data = d.body
    //     allTracks.push(...data.items);

    //     if (data.next) {
    //         await getTracks(offset + 100);
    //     }
    // }


    const d = await api.getPlaylistTracks(id);
    return allTracks;
}