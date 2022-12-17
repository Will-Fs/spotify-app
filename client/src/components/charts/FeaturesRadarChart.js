import { RadarChart } from 'react-vis';

export default function FeaturesRadarChart(props) {
  const data = props.data;
  const radarProps = {
    data: [{}],
    domains: [],
    height: window.innerWidth * 0.7,
    width: window.innerWidth * 0.7,
  };

  for (let stat in data) {
    radarProps.domains.push({ name: stat, domain: [0, 1] });
    radarProps.data[0][stat] = data[stat].avg;
  }

  // console.log(radarProps);
  return (
    <div className="radar-chart">
      <RadarChart
        data={radarProps.data}
        domains={radarProps.domains}
        height={radarProps.height}
        width={radarProps.width}
        margin={{ left: 100, top: 100, right: 100, bottom: 100 }}
        style={{ labels: { fill: 'white' } }}
      />
    </div>
  );
}
