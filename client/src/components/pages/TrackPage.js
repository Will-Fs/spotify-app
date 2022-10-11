import { api, postLocation } from "../../spotifyAuth";
import { InfoCard } from "../infoCards/InfoCard";
import uuid from 'react-uuid';
import axios from "axios";
import { Info } from "luxon";
import { useEffect, useState } from "react";
import { prototype } from "spotify-web-api-node";

const removeRemastered = (title) => {
    const index = title.indexOf(" - Remastered");
    if (index != -1) {
        return title.substring(0, index);
    }
    return title;
}

const RenderIt = (props) => {
    const [lyrics, setLyrics] = useState();

    useEffect(() => {
        const trySetLyrics = async (params) => {
            const res = await axios.post(postLocation + "lyrics", params)

            let _lyrics = res.data.lyrics ? res.data.lyrics : "Problem Getting Lyrics";
            _lyrics = _lyrics.replace(/\n/g,"<br />");


            setLyrics(_lyrics);
        }

        const doTheThing = async () => {
            await trySetLyrics({title: props.title, artist: props.artist});

            if (!lyrics) {
                let index = props.artist.indexOf("&");
                if (index) {
                    trySetLyrics({title: props.title, artist: props.artist.substring(0, index)});
                }
                if (!lyrics) {
                    trySetLyrics({title: props.title, artist: props.artist.substring(index, props.artist.length - 1)});
                }
                
            }
        }
        doTheThing();
    }, []);

    return (
        <div className="object-info">
            <div className="object-info-container">
                <InfoCard type="track" object={true} id={props.id}></InfoCard>
                <div className="object-bottom-container">
                    <div className="object-bottom-info">
                        {/* <h3>{data.owner.display_name}</h3> */}
                    </div>
                </div>
            </div>
            <div className="secondary-object-info track">
                <h1 align="left" style={{width: "90%", paddingLeft: "5%", marginBottom: "30px"}}>
                    Lyrics <small style={{fontSize: "16px"}}>
                        from <a href="https://genius.com/" style={{textDecoration: "underline"}} target="new" title="Opens in a new tab">Genius</a>
                    </small>
                </h1>
                <p id="lyrics" style={{color: "var(--body-secondary-foreground-color)", fontWeight: "600", fontSize: "20px"}} 
                    dangerouslySetInnerHTML={{__html: lyrics ?? "loading..."}} 
                />
                <InfoCard type="artist" id={props.artistId} style={{background: "none"}}></InfoCard>
            </div>
        </div>
        )
}


export const TrackPage = async id => {
    const d = await api.getTrack(id);
    const data = d.body;

    const artist = data.artists[0].name;
    const title = removeRemastered(data.name);

    return <RenderIt artistId={data.artists[0].id} id={id} artist={artist} title={title} />

    
}