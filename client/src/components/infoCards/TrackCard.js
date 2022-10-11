import { getCardData } from "../../utility/infoCardData";

export const getTrackCardData = async (props) => {
    const d = await getCardData("track", props.id);
    let link = `${window.location.origin}/track?id=${props.id}`;

    const data = d.data;
    const additionalData = d.additionalData;
    // console.log(`ArtistCard Data: ${add}`);

    const isTopTrack = props.isTopTrack === true;
    const timeFrame = isTopTrack ? props.timeFrame : null;

    let firstLabel = data.artists[0].name;
    let secondLabel = null;

    if (isTopTrack) {
        if (timeFrame === "short")
            secondLabel = "Top track this month";
        else if (timeFrame === "medium")
            secondLabel = "Top track past 6 months";
        else {
            secondLabel = "Top track all-time";
        }
    }

    const img = data.album.images[0].url

    const color = additionalData.colorData;

    const titleHeader = isTopTrack ? <h2 className="card-title" style={{color: color.foregroundColor}}>{secondLabel}</h2> : null;
    const name = data.name;

    let secondLabelHeader = !isTopTrack ? <p className="second-card-label">{secondLabel}</p> : null;

    let typeHeader;
    if (props.object === true) {
        link = null;
        const root = document.documentElement;
        root.style.setProperty("--object-info-bg-color", color.bgTopColor);
        firstLabel = null;

        const totalTime = Math.round(data.duration_ms / 1000);
        if (totalTime > 36000)
            return `about ${ Math.round(totalTime)} hr`;
    
        let hours = Math.floor(totalTime/3600);
        let minutes = Math.floor((totalTime - hours) / 60);
        let seconds = Math.round(totalTime - hours - minutes*60);

        if (hours < 10 && hours > 0)
            hours = "0"+hours;
        if (minutes < 10 && minutes > 0 && hours > 0)
            minutes = "0"+minutes;
        if (seconds < 10)
            seconds = "0"+seconds;
    
        const durationText = `${hours > 0 ? `${hours}:` : ""}${minutes > 0 ? `${minutes}:` : ""}${seconds}`;

        secondLabelHeader = <p className="second-card-label">
            <b style={{color: "var(--body-secondary-foreground-color)", fontWeight: "normal"}}>by </b>
            {`${data.artists[0].name} • ${durationText}`}
        </p>;
        // typeHeader = <h6 style={{marginTop: "5px", color: color.secondaryColor}}>Track</h6>
    }

    const type = "track";

    return {img, color, titleHeader, firstLabel, name, secondLabelHeader, typeHeader, type, link};
}