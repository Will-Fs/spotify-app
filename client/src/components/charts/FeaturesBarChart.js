import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  LabelSeries,
} from 'react-vis';

export default function FeaturesBarChart(props) {
  const parsedData = [];
  const data = props.data;
  console.log(data);

  for (let stat in data) {
    parsedData.push({ x: stat, y: data[stat].avg });
  }

  return (
    <div style={{ padding: '10px' }} className="bar-chart">
      <XYPlot
        xType="ordinal"
        width={window.innerWidth * 0.8}
        height={500}
        yDomain={[0, 1]}
      >
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={parsedData} color="" />
      </XYPlot>
    </div>
  );
}
