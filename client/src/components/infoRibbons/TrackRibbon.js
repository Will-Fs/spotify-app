import { get } from "spotify-web-api-node/src/http-manager";
import { setImageSize } from "../../imageSize";
const {DateTime} = require('luxon');

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

export const TrackRibbon = (props) => {
    const data = props.trackData.track;
    let link = `${window.location.origin}/track?id=${data.id}`;
        
    const image = data.album.images[0].url;
    const name = data.name;

    const {dateAddedtext, durationText} = getTimeStuff(props.trackData.added_at, data.duration_ms);

    return (
    <div className="track-ribbon">
        <p className="track-number">{props.trackNumber}</p>
        <div className="track-title-info-container">
            <img src={image} onLoad={setImageSize} alt="Spotify Track Image"></img>
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
}