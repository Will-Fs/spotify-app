import { api, postLocation } from "../../spotifyAuth";
import { InfoCard } from "../infoCards/InfoCard";
import uuid from 'react-uuid';
import axios from "axios";
import { Info } from "luxon";

const removeRemastered = (title) => {
    const index = title.indexOf(" - Remastered");
    if (index != -1) {
        return title.substring(0, index);
    }
    return title;
}


export const TrackPage = async id => {
    const d = await api.getTrack(id);
    const data = d.body;

    const artist = data.artists[0].name;
    const title = removeRemastered(data.name);

    return axios.post(postLocation + "lyrics", {title, artist}).then(
        res => {
            const lyrics = res.data.lyrics ? res.data.lyrics : "Problem Getting Lyrics";
            return lyrics.replace(/\n/g,"<br />");
            
        }
    ).then (lyrics => {
        return (
        <div className="object-info">
            <div className="object-info-container">
                <InfoCard type="track" object={true} id={id}></InfoCard>
                <div className="object-bottom-container">
                    <div className="object-bottom-info">
                        {/* <h3>{data.owner.display_name}</h3> */}
                    </div>
                </div>
            </div>
            <div className="secondary-object-info track">
                <h1 align="left" style={{width: "90%", paddingLeft: "15%", marginBottom: "30px"}}>
                    Lyrics <small style={{fontSize: "16px"}}>
                        from <a href="https://genius.com/" style={{textDecoration: "underline"}} target="new" title="Opens in a new">Genius</a>
                    </small>
                </h1>
                <p id="lyrics" style={{color: "var(--body-secondary-foreground-color)", fontWeight: "600", fontSize: "20px"}} dangerouslySetInnerHTML={{__html: lyrics}} />
                <InfoCard type="artist" id={data.artists[0].id} style={{background: "none"}}></InfoCard>
            </div>
        </div>
        )
    })

    
}