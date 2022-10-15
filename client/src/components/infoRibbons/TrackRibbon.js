import { get } from "spotify-web-api-node/src/http-manager";
import { setImageSize } from "../../imageSize";
import { findLargestImage } from "../../utility/findLargestImage";
const {DateTime} = require('luxon');
import {React, memo} from 'react';

const getTimeStuff = (rawDate, rawDuration) => {
    let dateAddedtext, durationText;

    const dateAdded = DateTime.fromISO(rawDate);
    const dateNow = DateTime.now();

    const diff = dateAdded.diff(dateNow, ["days"]);
    const daysSince = Math.round(Math.abs(diff.days));


    if (daysSince < 10) {
        if (daysSince < 1)
            dateAddedtext = "Less than 1 day ago";
        else
            dateAddedtext = `${daysSince} day${daysSince > 1 ? "s" : ""} ago`;
    }
    else
        dateAddedtext = dateAdded.toLocaleString(DateTime.DATE_MED);

    const duration = Math.round(rawDuration / 1000);
    const durationHr = Math.floor(duration / 3600)
    const durationMin = Math.floor((duration - durationHr*3600) / 60);
    const durationSec = duration - (durationHr * 3600 + durationMin * 60);

    durationText = `${durationHr > 0 ? `${durationHr}:` : ""}${durationMin}:${durationSec < 10 ? `0${durationSec}` : durationSec} `;

    return {dateAddedtext, durationText};
}

export const TrackRibbon = memo(({data, index, style}) => {
    data = data.tracks[index];
    if (!data)
        return null;
    const {dateAddedtext, durationText} = getTimeStuff(data.added_at, data.track.duration_ms);

    data = data.track;
   
    let link = `${window.location.origin}/track?id=${data.id}`;
        
    const img = data.album.images ? findLargestImage(data.album.images) : null;
    const name = data.name;

    // console.log(data);


    return (
    <div className="track-ribbon" style={style}>
        <div className="ribbon-filler"></div>
        <p className="track-number">{index}</p>
        <div className="track-title-info-container">
            <img src={img} onLoad={setImageSize} alt="Spotify Track Image"></img>
            <div className="track-title-info">
                <h3 className={`track-ribbon-name link`}
                    onClick={()=>{window.location.href = link}}>{name}</h3>
                <p className="track-ribbon-artist">{data.artists[0].name}</p>
            </div>
        </div>
        <p className="track-album-name">{data.album.name}</p>
        <p className="track-date-added">{dateAddedtext}</p>
        <p className="track-ribbon-duration">{durationText}</p>
    </div>
    );
})