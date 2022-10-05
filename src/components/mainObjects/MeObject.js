import { api } from "../../spotify"
import { InfoCard } from "../InfoCard";
import uuid from 'react-uuid';


export const renderMe = async () => {
    let topArtists = {};
    let topTracks = {};
    let error = null;
    return (
      api
        .getMyTopArtists({ time_range: "short_term" })
          .then(data => {
            topArtists.short = data.body.items[0];
            return api.getMyTopTracks({time_range: "short_term"});
          }, err => {
          error = err;
          return <h1>{`${err.body.error.status} Error: ${err.body.error.message}`}</h1>
          })
          .then(data => {
            if (error !== null) {
              return data;
            }
          
            topTracks.short = data.body.items[0];

            return api.getMyTopTracks({time_range: "long_term"});
          })
          .then (data => {
            if (error !== null) {
              return data;
            }
            topTracks.long = data.body.items[0];
            return api.getMyTopArtists({ time_range: "long_term" })
          })
          .then (data => {
            if (error !== null) {
              return data;
            }
            topArtists.long = data.body.items[0];
            return api.getUserPlaylists();
          })
          .then (data => {
            data = data.body;
            const content = (
            <div className="object-info">
              <div className="object-info-container">
                <InfoCard type="me" object={true}></InfoCard>
              </div>
              <div className="secondary-object-info">
                <h1 align="left" style={{width: "90%"}}>Quick Stats</h1>
                <InfoCard type="artist" id={topArtists.short.id} isTopArtist={true} timeFrame={"short"}></InfoCard>
                <InfoCard type="track" id={topTracks.short.id} isTopTrack={true} timeFrame={"short"}></InfoCard>
                <InfoCard type="artist" id={topArtists.long.id} isTopArtist={true} timeFrame={"long"}></InfoCard>
                <InfoCard type="track" id={topTracks.long.id} isTopTrack={true} timeFrame={"long"}></InfoCard>
              </div>
              <div className="additional-object-info">
              <div className="public-playlists">
                <h1 align="left" style={{marginBottom: "20px", width: "80%"}}>Your Public Playlists</h1>
                {data.items.map(playlist => {
                  if (playlist.public === true) {
                    return <InfoCard type="playlist" id={playlist.id} needsOwner={false} key={uuid()}></InfoCard>;
                  }
                })}
              </div>
              <div className="private-playlists">
                <h1 align="left" style={{marginBottom: "20px ", width: "80%"}}>Your Private Playlists</h1>
                  {data.items.map(playlist => {
                    if (playlist.public === false) {
                      return <InfoCard type="playlist" id={playlist.id} needsOwner={true} key={uuid()}></InfoCard>;
                    }
                  })}
                </div>
              </div>
            </div>
           
            );
            return content;
          })
    );
}