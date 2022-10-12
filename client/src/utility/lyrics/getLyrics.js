import axios from "axios";
import { postLocation } from "../../spotifyAuth";

export const getLyrics = async (title, artist) => {
    let lyrics = null;
    const _getLyrics = async params => {
        const res = await axios.post(postLocation + "lyrics", params)

        let _lyrics = res.data.lyrics ?? null;
        console.log(`lines: ${_lyrics.replace(/[^\n]/g, "").length}`)
        lyrics = _lyrics.replace(/\n/g,"<br />");
    }

    await _getLyrics({title, artist});
    if (!lyrics) {
        let index = artist.indexOf("&");
        if (index != -1) {
            trySetLyrics({title: title, artist: artist.substring(0, index)});
        }
        if (!lyrics != -1) {
            trySetLyrics({title: title, artist: artist.substring(index, artist.length - 1)});
        }
    }

    return lyrics ?? "Problem Getting Lyrics";
    
}