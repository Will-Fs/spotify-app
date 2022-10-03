import {getColorData, getColorInfo} from "./colorAnalyzer";
import {api} from "../spotify";

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