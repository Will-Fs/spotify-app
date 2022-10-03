import { api } from "../../spotify"
import { InfoCard } from "../InfoCard";

export const renderMe = (root) => {
    let topArtists = {};
    let topTracks = {};
    let error = null;
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
          root.render(data);
          return;
        }
      
        topTracks.short = data.body.items[0];

        return api.getMyTopTracks({time_range: "long_term"});
      })
      .then (data => {
        topTracks.long = data.body.items[0];
        return api.getMyTopArtists({ time_range: "long_term" })
      })
      .then (data => {
        topArtists.long = data.body.items[0];

        const content = 
        <div className="object-info">
            <InfoCard type="me" me={true}></InfoCard>
            <div className="secondary-object-info">
              <InfoCard type="artist" id={topArtists.short.id} isTopArtist={true} timeFrame={"short"}></InfoCard>
              <InfoCard type="track" id={topTracks.short.id} isTopTrack={true} timeFrame={"short"}></InfoCard>
              <InfoCard type="artist" id={topArtists.long.id} isTopArtist={true} timeFrame={"long"}></InfoCard>
              <InfoCard type="track" id={topTracks.long.id} isTopTrack={true} timeFrame={"long"}></InfoCard>
            </div>
        </div>;
        root.render(content);
      });
}