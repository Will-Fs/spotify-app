import { api } from '../../spotifyAuth';
import { InfoCard } from '../infoCards/InfoCard';
import { useEffect, useState } from 'react';
import { getLyrics } from '../../utility/trackInfo/getLyrics';
import {
  getTrackAnalysisRaw,
  getTrackFeaturesRaw,
} from '../../utility/trackInfo/trackAnalysis';

const removeRemastered = (title) => {
  let index = title.indexOf(' - Remastered');
  if (index != -1) {
    return title.substring(0, index);
  }

  const dates = title.match(/\d{4}/g);
  if (!dates) return title;
  if (dates.length != 0) {
    const date = dates[dates.length - 1];
    index = title.indexOf(` - ${date} Remaster`);
    if (index != -1) {
      return title.substring(0, index);
    }
  }

  return title;
};

const RenderIt = (props) => {
  const [lyrics, setLyrics] = useState();

  useEffect(() => {
    const doSetLyrics = async () => {
      const _lyrics = await getLyrics(props.title, props.artist);
      setLyrics(_lyrics);
    };
    doSetLyrics();
  }, []);

  return (
    <div className="object-info">
      <div className="object-info-container">
        <InfoCard type="track" object={true} id={props.id}></InfoCard>
        <div className="object-bottom-container">
          <div className="object-bottom-info">
            {/* <h3>{data.owner.display_name}</h3> */}
          </div>
        </div>
      </div>
      <div className="secondary-object-info track">
        <h1
          align="left"
          style={{ width: '90%', paddingLeft: '5%', marginBottom: '30px' }}
        >
          Lyrics{' '}
          <small style={{ fontSize: '16px' }}>
            from{' '}
            <a
              href="https://genius.com/"
              style={{ textDecoration: 'underline' }}
              target="new"
              title="Opens in a new tab"
            >
              Genius
            </a>
          </small>
        </h1>
        <p
          id="lyrics"
          style={{
            color: 'var(--body-secondary-foreground-color)',
            fontWeight: '600',
            fontSize: '20px',
          }}
          dangerouslySetInnerHTML={{ __html: lyrics ?? 'loading...' }}
        />
        <InfoCard
          type="artist"
          id={props.artistId}
          style={{ background: 'none' }}
        ></InfoCard>
      </div>
    </div>
  );
};

export const TrackPage = async (id) => {
  getTrackFeaturesRaw(id).then((data) => console.log(data));

  const d = await api.getTrack(id);
  const data = d.body;

  const artist = data.artists[0].name;
  const title = removeRemastered(data.name);

  return (
    <RenderIt
      artistId={data.artists[0].id}
      id={id}
      artist={artist}
      title={title}
    />
  );
};
