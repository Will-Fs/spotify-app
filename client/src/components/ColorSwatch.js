export const ColorSwatch = (props) => {
  const data = props.colorData;

  const rgbText = `rgb(${data.rgb.join(', ')})`;
  const hslText = `hsl(${data.hsl
    .map((color) => Math.round(color * 100) / 100)
    .join(', ')})`;
  return (
    <div className="color-swatch" style={{ backgroundColor: rgbText }}>
      <div className="color-swatch-filler"></div>
      <div className="color-swatch-info">
        <p>{hslText}</p>
        <br />
        <p>deltaHue: {Math.round(data.deltaHue * 100) / 100}</p>
        <br />
        <p>deltaSat: {Math.round(data.deltaSaturation * 100) / 100}</p>
        <br />
        <p>deltaLight: {Math.round(data.deltaLightness * 100) / 100}</p>
        <br />
        <p>distance: {Math.round(data.distance * 100) / 100}</p>
      </div>
    </div>
  );
};
