import {getColorData, getColorInfo} from "./colorAnalyzer";
import {api} from "../spotify";

const getAdditionalUserInfo = async id => {
    const data = {};
    const playlistData = await api.getUserPlaylists(id, { limit: '50' });
    const publicPlaylists = playlistData.body.items.filter(playlist => playlist.public);
    data.playlistData = {
        publicPlaylists: publicPlaylists,
        numPublicPlaylists: publicPlaylists.length,
        playlists: playlistData.body.items,
        numPlaylists: playlistData.body.items.length
    };
    return data;
}

const getUser = async id => {

}

const getMe = async () => {
    let data = await api.getMe();
    data = data.body;
    const colorData = await getColorData(data.images[0].url);
    const additionalData = await getAdditionalUserInfo(data.id);

    additionalData.colorData = getColorInfo(colorData);

    return {data, additionalData};
}

const getArtist = async id => {
  let data = await api.getArtist(id);
  data = data.body;
  const colorData = await getColorData(data.images[0].url);

  const additionalData = {colorData: getColorInfo(colorData)};

  return {data, additionalData};
}

const getTrack = async id => {
    let data = await api.getTrack(id);
    data = data.body;
    const colorData = await getColorData(data.album.images[0].url);

    const additionalData = {colorData: getColorInfo(colorData)};

    return {data, additionalData};
}


export const getCardData = async (type, id) => {
  try {
    switch (type) {
        case "me":
            return await getMe();
        case "user":
            return await getUser(id);
        case "track":
            return await getTrack(id);
        case "artist":
            const data = await getArtist(id);
            return data;
        default:
            return null;
    }
  } catch (e) {
    console.log(e);
  }
}