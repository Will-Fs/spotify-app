import { getCardData } from "../../utility/targetData";

const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const getArtistCardData = async (props) => {
    const d = await getCardData("artist", props.id);

    const data = d.data;
    const additionalData = d.additionalData;
    // console.log(`ArtistCard Data: ${add}`);

    const isTopArtist = props.isTopArtist === true;
    const timeFrame = isTopArtist ? props.timeFrame : null;

    const firstLabel = `${formatter.format(data.followers.total)} Followers`;
    let secondLabel = "Artist";

    if (isTopArtist) {
        if (timeFrame === "short")
            secondLabel = "Top artist this month";
        else if (timeFrame === "medium")
            secondLabel = "Top artist past 6 months";
        else {
            secondLabel = "Top artist all-time";
        }
    }

    const img = data.images[0].url;

    const color = additionalData.colorData;

    const titleHeader = isTopArtist ? <h2 className="card-title" style={{color: color.foregroundColor}}>{secondLabel}</h2> : null;
    const name = data.name;

    const secondLabelHeader = !isTopArtist ? <p className="second-card-label" style={{ color: color.foregroundColor }}>{secondLabel}</p> : null

    return {img, color, titleHeader, firstLabel, name, secondLabelHeader}
}