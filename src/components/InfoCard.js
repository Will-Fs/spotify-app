import React, { useEffect, useState } from 'react';
import {setImageSize} from "../imageSize"
import {getArtistCardData} from "./infoCards/ArtistCard"
import { getTrackCardData } from './infoCards/TrackCard';
import { getMeCardData } from './infoCards/MeCard';

export const cardBackground = (bottomColor, topColor) => {
    // return 'none'
    return `linear-gradient(to top, ${bottomColor}, ${topColor}`;
}

export const InfoCardRender = (data) => {
    data = data.data;
    const bgImage = data.me !== true ? cardBackground(data.color.bottomColor, data.color.topColor) : null
    return (
        <div className={`card-large ${data.me === true ? "card-me" : ""}`} style={{backgroundImage: bgImage}}>
            {data.titleHeader ?? null}
            <img onLoad = {setImageSize} id='profile-img' src={data.img} alt={`Spotify Info Card`}></img>
            <div className="profile-stats">
                <h1 id='name' style={{ color: data.color.foregroundColor }}>{data.name}</h1>
                <h2 className="first-card-label " style={{ color: data.color.foregroundColor }}>{data.firstLabel}</h2>
            {data.secondLabelHeader ?? null}
          </div>
        </div>
    )
}

export const InfoCard = props => {
    const _getCardData = async() => {
        switch (props.type) {
            case "artist":
                return getArtistCardData(props);
            case "track":
                return getTrackCardData(props);
            case "me":
                return getMeCardData(props);
            default:
                return <h1>Unknown</h1>
        }
    }
    

    const [data, updateData] = useState();
    useEffect(() => {
      const getData = async () => {
        if (data)
          return;
        const resp = await _getCardData();
        updateData(resp);
      }
      getData();
    });
  
    return data && <InfoCardRender data={data} />;

}