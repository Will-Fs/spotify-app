import { getCardData } from "../../utility/infoCardData";

export const getTrackCardData = async (props) => {
    const d = await getCardData("track", props.id);

    const data = d.data;
    const additionalData = d.additionalData;
    // console.log(`ArtistCard Data: ${add}`);

    const isTopTrack = props.isTopTrack === true;
    const timeFrame = isTopTrack ? props.timeFrame : null;

    const firstLabel = data.artists[0].name;
    let secondLabel = "Track";

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

    const secondLabelHeader = !isTopTrack ? <p className="second-card-label">{secondLabel}</p> : null;

    let typeHeader;
    if (props.object === true) {
        const root = document.documentElement;
        root.style.setProperty("--object-info-bg-color", color.bgTopColor);
        typeHeader = <h6 style={{marginTop: "5px", color: color.secondaryColor}}>PLAYLIST</h6>
    }

    return {img, color, titleHeader, firstLabel, name, secondLabelHeader, typeHeader};
}