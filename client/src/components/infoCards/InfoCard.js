import React, { useEffect, useState } from 'react';
import {setImageSize} from "../../imageSize"
import {getArtistCardData} from "./ArtistCard"
import { getTrackCardData } from './TrackCard';
import { getMeCardData } from './MeCard';
import { getPlaylistCardData } from './PlaylistCard';

export const cardBackground = (bottomColor, topColor) => {
    // return 'none'
    return `linear-gradient(to top, ${bottomColor}, ${topColor}`;
}

export const InfoCardRender = (data) => {
    data = data.data;

    const bgImage = data.object !== true ? cardBackground(data.color.bottomColor, data.color.topColor) : null
    return (
        <div className={`card-large ${data.object === true ? `card-object ${data.type ?? ""}` : ""}`} style={{backgroundImage: bgImage}}>
            {data.titleHeader ?? null}
            <img onLoad={setImageSize} id='profile-img' src={data.img} alt={`Spotify Info Card`} 
                className={data.link ? "link" : null}
                onClick={data.link ?  ()=>{window.location = data.link} : null} 
            />
            <div className="profile-stats">
                {data.name ? 
                    <h1 id='name' className={data.link ? "link" : null}
                    onClick={data.link ?  ()=>{window.location = data.link} : null} 
                    style={{ color: data.color.foregroundColor}}
                    dangerouslySetInnerHTML={{__html: data.name}}>
                    </h1>
                    : null}
                {data.firstLabel ? 
                     <h2 className="first-card-label " style={{ color: data.color.secondaryColor }} dangerouslySetInnerHTML={{__html: data.firstLabel}}></h2>
                    : null}
            {data.secondLabelHeader ?? null}
            {data.typeHeader ?? null}
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
            case "playlist":
                    return getPlaylistCardData(props);
            default:
                return <h1>Unknown</h1>
        }
    }
    
    const [data, updateData] = useState();
    useEffect(() => {
      const getData = async () => {
        const resp = await _getCardData();
        resp.object = props.object;
        updateData(resp);
      }
      getData();
    }, []);
  
    return data && <InfoCardRender data={data} />;

}