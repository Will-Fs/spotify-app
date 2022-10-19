import { getCardData } from '../../utility/infoCardData';
import { findLargestImage } from '../../utility/findLargestImage';

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export const getArtistCardData = async (props) => {
  const d = await getCardData('artist', props.id);

  const data = d.data;
  const additionalData = d.additionalData;
  // console.log(`ArtistCard Data: ${add}`);

  const isTopArtist = props.isTopArtist === true;
  const timeFrame = isTopArtist ? props.timeFrame : null;

  const firstLabel = `${formatter.format(data.followers.total)} Follower${
    data.followers.total > 1 ? 's' : ''
  }`;
  let secondLabel = 'Artist';

  if (isTopArtist) {
    if (timeFrame === 'short') secondLabel = 'Top artist this month';
    else if (timeFrame === 'medium') secondLabel = 'Top artist past 6 months';
    else {
      secondLabel = 'Top artist all-time';
    }
  }

  const img = findLargestImage(data.images);

  const color = additionalData.colorData;

  const titleHeader = isTopArtist ? (
    <h2 className="card-title" style={{ color: color.foregroundColor }}>
      {secondLabel}
    </h2>
  ) : null;
  const name = data.name;

  const secondLabelHeader = !isTopArtist ? (
    <p className="second-card-label" style={{ color: color.foregroundColor }}>
      {secondLabel}
    </p>
  ) : null;

  let typeHeader;
  if (props.object === true) {
    const root = document.documentElement;
    root.style.setProperty('--object-info-bg-color', color.bgTopColor);
    typeHeader = (
      <h6 style={{ marginTop: '5px', color: color.secondaryColor }}>
        PLAYLIST
      </h6>
    );
  }

  return {
    img,
    color,
    titleHeader,
    firstLabel,
    name,
    secondLabelHeader,
    typeHeader,
  };
};
