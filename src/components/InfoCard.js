import React, { useEffect, useState } from 'react';
import {getCardData} from "../utility/targetData";
import {setImageSize} from "../imageSize"
import {getArtistCardData} from "./infoCards/ArtistCard"
import { getTrackCardData } from './infoCards/TrackCard';

const formatter = Intl.NumberFormat("en", { notation: 'compact' });

export const cardBackground = (bottomColor, topColor) => {
    return `linear-gradient(to top, ${bottomColor}, ${topColor}`;
}

export const InfoCardRender = (data) => {
    data = data.data;
    console.log(data);
    return (
        <div className="card-large" style={{backgroundImage: cardBackground(data.color.bottomColor, data.color.topColor)}}>
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

export const NewInfoCard = props => {
    const _getCardData = async() => {
        switch (props.type) {
            case "artist":
                return getArtistCardData(props);
            case "track":
                return getTrackCardData(props);
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

export function InfoCard(props) {
    const type = props.type;
    const id = props.id;
  
    const ActualInfoCard = (_props) => {
      const data = _props.data;
      const color = data.additionalData.colorData;
      const targetData = data.targetData;
      const name = (type === "artist" || type === "track") ? targetData.name : (type === "user" || type === "me") ? targetData.display_name : "PLACEHOLDER";
      const imgURL = targetData.images[0].url;
      const foregroundColor = type === "me" ? "var(--body-foreground-color)" : color.foregroundColor;
  
      let firstLabel = "Unknown";
      let secondLabel = "Unknown";
      if (type === "user" || type === "me") {
        
        firstLabel = `${formatter.format(targetData.followers.total)} Followers • ${data.additionalData.playlistData.numPublicPlaylists} Public Playlists`;
      }
      else if (type === "artist") {
        firstLabel = `${formatter.format(targetData.followers.total)} Followers`;
        secondLabel = "Artist";
      }
      else if (type === "playlist") {
        console.log(data);
      }
      else if (type === "track") {
        firstLabel = targetData.artists[0].name;
        secondLabel = "Track"
      }
  
      const additionalInfoType = props.additionalData?.type;
  
      const needsCardTitle = ["top_track", "top_artist"].includes(additionalInfoType);
      const needsSecondaryLabel = !needsCardTitle && type !== "me";
      const cardTitleText = 
        additionalInfoType === "top_track" ? "Top track this month" : 
        additionalInfoType === "top_artist" ? "Top artist this month" : 
        "Placeholder";
      let cardTitle = null;
      if (needsCardTitle)
        cardTitle = <h2 className="card-title" style={{ color: foregroundColor }}>{cardTitleText}</h2>;
  
      const cardStyle = type !== "me" ? 
      { backgroundImage: `linear-gradient(to top, ${color.bottomColor}, ${color.topColor}`, filter: "saturate(2)" } : null;
  
      if (type === "me") {
        const root = document.documentElement;
        root.style.setProperty("--user-info-bg-color", color.bgTopColor);
      }
  
  
      return (
        <div className={`card-large ${type === "me" ? "card-me" : ""}`} style={cardStyle}>
          {cardTitle}
          <img onLoad = {setImageSize} id='profile-img' src={imgURL} alt={`Spotify Info Card of type ${type}`} style={type !== "me" ? { filter: "saturate(0.5)" } : null}></img>
          <div className="profile-stats">
            <h1 id='name' style={{ color: foregroundColor }}>{name}</h1>
            <h2 className="first-card-label " style={{ color: foregroundColor }}>{firstLabel}</h2>
            {needsSecondaryLabel ? <p className="second-card-label" style={{ color: foregroundColor }}>{secondLabel}</p> : null}
          </div>
        </div>
      );
    }
  
    const [data, updateData] = useState();
    useEffect(() => {
      const getData = async () => {
        if (data)
          return;
        const resp = await getCardData(type, id);
        updateData(resp);
      }
      getData();
    });
  
    return data && <ActualInfoCard data={data} />;
  }