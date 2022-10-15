/* eslint-env jquery */
import React, { useEffect, useState } from 'react';
import {setImageSize} from "../../imageSize"
import {getArtistCardData} from "./ArtistCard"
import { getTrackCardData } from './TrackCard';
import { getMeCardData } from './MeCard';
import { getPlaylistCardData } from './PlaylistCard';
import uuid from 'react-uuid';
import { ColorSwatch } from '../ColorSwatch';

export const cardBackground = (bottomColor, topColor) => {
    // return 'none'
    return `linear-gradient(to top, ${bottomColor}, ${topColor}`;
}

export const InfoCardRender = (data) => {
    data = data.data;

    useEffect(() => {
        const title = $("#name-main");
        $("#name-main").fitText(2.5, {minFontSize: "25px", maxFontSize: "50px"});

    }, []);

    const bgImage = data.object !== true ? cardBackground(data.color.bottomColor, data.color.topColor) : null
    return (
        <div className={`card-large ${data.object === true ? `card-object ${data.type ?? ""}` : ""}`} style={{backgroundImage: bgImage}}>
            {data.titleHeader ?? null}
            <img onLoad={setImageSize} id='profile-img' src={data.img} alt={`Spotify Info Card`} 
                className={data.link ? "link" : null}
                onClick={data.link ?  ()=>{window.location = data.link} : null} 
                style={{boxShadow: data.type !== "me" && data.object === true ? "0 0 10vw 0px rgba(var(--body-bg-color-value), 0.5)" : null}}
            />
            <div className="profile-stats">
                {data.name ? 
                    <h1 id={`name${data.object === true ? "-main" : ""}`} className={data.link ? "link" : null}
                    onClick={data.link ?  ()=>{window.location = data.link} : null} 
                    style={{ 
                        color: data.color.foregroundColor, 
                        width: data.object !== true ? "100%": null, 
                        whiteSpace: data.object !== true ? "nowrap" : null,
                        overflow: data.object !== true ? "hidden": null
                    }}
                    dangerouslySetInnerHTML={{__html: data.name}}
                    >
                    </h1>
                    : null}
                {data.firstLabel ? 
                     <h2 className="first-card-label " style={{ color: data.color.secondaryColor }} dangerouslySetInnerHTML={{__html: data.firstLabel}}></h2>
                    : null}
            {data.secondLabelHeader ?? null}
            {data.typeHeader ?? null}
            {data.titleHeader || data.type === "me" ? null : 
                <div className="color-swatches">
                    {data.color.allColors.map(color => <ColorSwatch colorData={color} key={uuid()}/>)}
                </div>
            }
            

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