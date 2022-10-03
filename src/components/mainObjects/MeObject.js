import { api } from "../../spotify"
import { InfoCard } from "../InfoCard";

export const Me = () => {
    let topArtist;
    api
    .getMyTopArtists({ time_range: "short_term" })
      .then(data => {
        topArtist = data.body.items[0];
        return api.getMyTopTracks({time_range: "short_term"});
      })
      .then(data => {
        const topTrack = data.body.items[0];
        <div className="object-info">
            <InfoCard type="me" me={true}></InfoCard>
            <InfoCard type="artist" id={topArtist.id} isTopArtist={true} timeFrame={"short"}></InfoCard>
            <InfoCard type="track" id={topTrack.id} isTopTrack={true} timeFrame={"short"}></InfoCard>
        </div>
      });
}