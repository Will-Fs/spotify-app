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
    const additionalData = getAdditionalUserInfo(data.id);

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


export const _getCardData = async (type, id) => {
    switch (type) {
        case "me":
            return await getMe(id);
        case "user":
            return await getUser(id);
        case "track":
            return await getTrack(id);
        case "artist":
            const data = await getArtist(id);
            console.log(data);
            return data;
        default:
            return null;
    }
}

export const getCardData = async (type, id) => {
    let targetData = {};
    let additionalData = {};
  
    const _getUserPlaylistData = async () => {
      return api.getUserPlaylists(id, { limit: '50' });
    }
  
    const _getTargetData = async () => {
      if (type === "me") {
        return api.getMe();
      }
      if (type === "user") {
        return api.getUser(id);
      }
      if (type === "artist") {
        return api.getArtist(id);
      }
      if (type === "playlist") {
        return api.getPlaylist(id);
      }
      if (type === "track") {
        return api.getTrack(id);
      }
    }
  
    const _targetData = await _getTargetData();
    targetData = _targetData.body;
    if (type === "track")
      targetData.images = targetData.album.images;
  
    const colorData = await getColorData(targetData.images[0].url);
  
    if (type === "user" || type === "me") {
      if (type === "me") {
        id = targetData.id;
      }
      const playlistData = await _getUserPlaylistData();
      const publicPlaylists = playlistData.body.items.filter(playlist => playlist.public);
      additionalData.playlistData = {
        publicPlaylists: publicPlaylists,
        numPublicPlaylists: publicPlaylists.length,
        playlists: playlistData.body.items,
        numPlaylists: playlistData.body.items.length
      };
    }
  
    additionalData.colorData = getColorInfo(colorData);
  
    return { targetData: targetData, additionalData: additionalData };
  }