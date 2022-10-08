import { getCardData } from "../../utility/infoCardData"

const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const getPlaylistCardData = async props => {
    const d = await getCardData("playlist", props.id);
    const data = d.data;
    const additionalData = d.additionalData;

    const name = data.name;
    const img = data.images[0].url;

    const needsOwner = props.needsOwner === true;

    const titleHeader = null;//needsOwner ? data.owner.display_name : null;
    const followers = data.followers.total > 0 ? `${formatter.format(data.followers.total)} follower${data.followers.total>1?"s":""}` : null;

    const color = additionalData.colorData;

    let secondLabelHeader, firstLabel;
    if (needsOwner) {
        firstLabel = data.owner.display_name;
        secondLabelHeader = <p className="second-card-label" style={{color: color.secondaryColor}}>{followers}</p>;
    }
    else {
        firstLabel = followers
    }

    return {img, color, titleHeader, firstLabel, name, secondLabelHeader}
}