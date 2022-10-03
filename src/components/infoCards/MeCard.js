import { getCardData } from "../../utility/targetData";

const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const getMeCardData = async (props) => {
    const d = await getCardData("me");

    const data = d.data;
    const additionalData = d.additionalData;
    const firstLabel = `${formatter.format(data.followers.total)} Followers • ${additionalData.playlistData.numPublicPlaylists} Public Playlists`;

    const img = data.images[0].url;

    const color = additionalData.colorData;
    color.foregroundColor = "white";

    const name = data.display_name;

    const root = document.documentElement;
    root.style.setProperty("--object-info-bg-color", color.bgTopColor);


    return {img, color, firstLabel, name, me: true}
}