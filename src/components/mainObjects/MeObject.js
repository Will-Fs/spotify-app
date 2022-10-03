import { api } from "../../spotify"
import { InfoCard } from "../InfoCard";

export const renderMe = (root) => {
    let topArtist;
    let error = null;
    api
    .getMyTopArtists({ time_range: "short_term" })
      .then(data => {
        topArtist = data.body.items[0];
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
        const topTrack = data.body.items[0];
        const content = 
        <div className="object-info">
            <InfoCard type="me" me={true}></InfoCard>
            <InfoCard type="artist" id={topArtist.id} isTopArtist={true} timeFrame={"short"}></InfoCard>
            <InfoCard type="track" id={topTrack.id} isTopTrack={true} timeFrame={"short"}></InfoCard>
        </div>;
        root.render(content);
      }, err => {
        console.log(err);
      });
}