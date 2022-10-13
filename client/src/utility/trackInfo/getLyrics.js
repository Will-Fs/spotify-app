import axios from "axios";
import { postLocation } from "../../spotifyAuth";

export const getLyrics = async (title, artist) => {
    let lyrics = null;
    const _getLyrics = async params => {
        const res = await axios.post(postLocation + "lyrics", params)

        let _lyrics = res.data.lyrics ?? null;
        lyrics = _lyrics ? _lyrics.replace(/\n/g,"<br />") : null;
    }

    await _getLyrics({title, artist});
    if (!lyrics) {
        let index = artist.indexOf("&");
        if (index != -1) {
            await _getLyrics({title: title, artist: artist.substring(0, index)});
        }
        if (!lyrics && index != -1) {
            await _getLyrics({title: title, artist: artist.substring(index, artist.length - 1)});
        }
    }

    return lyrics ?? "Problem Getting Lyrics";
    
}