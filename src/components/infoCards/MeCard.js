import { getCardData } from "../../utility/targetData";

const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const getMeCardData = async (props) => {
    const d = await getCardData("me");

    const data = d.data;
    const additionalData = d.additionalData;
    const firstLabel = `${formatter.format(data.followers.total)} Follower${data.followers.total>1?"s":""}\
     • ${additionalData.playlistData.numPublicPlaylists} Public Playlist${additionalData.playlistData.numPublicPlaylists>1?"s":""}`;

    const img = data.images[0].url;

    const color = additionalData.colorData;
    color.foregroundColor = "var(--body-foreground-color)";

    const name = data.display_name;

    const root = document.documentElement;
    root.style.setProperty("--object-info-bg-color", color.bgTopColor);


    return {img, color, firstLabel, name}
}