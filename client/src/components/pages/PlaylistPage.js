import { api } from "../../spotifyAuth";
import { InfoCard } from "../infoCards/InfoCard";
import { getAllPlaylistTracks, calcLength } from "../../utility/getPlaylistTracks";
import { TrackRibbon } from "../infoRibbons/TrackRibbon";
import uuid from 'react-uuid';

export const PlaylistPage = async id => {
    let tracks = [];

    const d = await api.getPlaylist(id);
    const data = d.body;

    const allTracks = await getAllPlaylistTracks(id);
    const playlistLength = calcLength(allTracks);
    
    let i = 0;

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
        <div className="secondary-object-info playlist">
          <h1 align="left" style={{width: "90%"}}>Tracks</h1>
          <div className="tracks-header">
            <p>#</p>
            <p>TITLE</p>
            <p>ALBUM</p>
            <p>DATE ADDED</p>
            <p>DURATION</p>

          </div>
          {allTracks.map((track) => {
            i++;
            return <TrackRibbon trackData={allTracks[i-1]} trackNumber={i} key={uuid()}/>;
          })}
        </div>
        <div className="additional-object-info">
        </div>
      </div>
    )
}