import { api } from "../../spotify";
import { InfoCard } from "../infoCards/InfoCard";
import { getAllPlaylistTracks, calcLength } from "../../utility/getPlaylistTracks";
import { uuid } from 'react-uuid';

export const PlaylistPage = async id => {
    let tracks = [];

    const d = await api.getPlaylist(id);
    const data = d.body;

    const allTracks = await getAllPlaylistTracks(id);
    const playlistLength = calcLength(allTracks);
    

    return (
        <div className="object-info">
        <div className="object-info-container">
          <InfoCard type="playlist" object={true} id={id} needsOwner={false} numTracks={allTracks.length} totalTime={playlistLength}></InfoCard>
          <div className="object-bottom-container">
            <div className="object-bottom-info">
                {/* <h3>{data.owner.display_name}</h3> */}
            </div>
          </div>
        </div>
        <div className="secondary-object-info">
          <h1 align="left" style={{width: "90%"}}>Secondary Info (?)</h1>
          
        </div>
        <div className="additional-object-info">
            <h1 align="left" style={{width: "90%"}}>Additional Info</h1>

        </div>
      </div>
    )
}