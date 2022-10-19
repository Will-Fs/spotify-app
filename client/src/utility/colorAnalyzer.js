import * as Vibrant from 'node-vibrant';
import Color from 'color';

const usePageColors = true;
const colorThreshold = 160;
const bgColorMult = 0;
const opacity = 1;

const idealSaturation = 1;
const idealLightness = 0.7;
const idealHue = 0.8;

const dHueMult = 1;
const dSatMult = 0.7;
const dLightMult = 0.4;

const satNum = 0.75;
const lightNum = 140;

const getBestColor = (colors) => {
  const bestColor = { distance: Number.MAX_SAFE_INTEGER, color: null };

  let maxDistance = 0;
  const allColors = [];
  for (const [_, color] of Object.entries(colors)) {
    const hsl = color.getHsl();
    const hueDistance = Math.abs(0.1 - hsl[0]);
    const deltaHue =
      ((hueDistance < 0.1 && hsl[1] < 0.85) || hsl[2] > 0.7
        ? 0.01 / hueDistance
        : 0) * dHueMult;
    const deltaSaturation = Math.abs(idealSaturation - hsl[1]) * dSatMult;
    const deltaLightness = Math.abs(idealLightness - hsl[2]) * dLightMult;
    const distance = Math.sqrt(
      deltaSaturation * deltaSaturation +
        deltaLightness * deltaLightness +
        deltaHue * deltaHue
    );

    if (distance < bestColor.distance) {
      bestColor.distance = distance;
      bestColor.color = color;
    }

    if (distance > maxDistance) maxDistance = distance;

    allColors.push({
      hsl,
      rgb: color.getRgb(),
      deltaHue,
      deltaSaturation,
      deltaLightness,
      distance,
    });
  }

  allColors.forEach((color) => {
    color.distance /= maxDistance;
  });

  const sat = bestColor.color.getHsl()[1];
  const mult = (satNum - sat) / sat;
  let c = new Color(bestColor.color.getRgb());

  // c = c.saturate(mult);

  return { bestColor: c.rgb().color, allColors };
};

export const getColorInfo = (color) => {
  // console.log(color);
  const { bestColor, allColors } = getBestColor(color);

  const avgColor = bestColor.slice(0, 3).reduce((a, b) => a + b) / 3;

  return {
    foregroundColor: usePageColors
      ? 'var(--body-foreground-color)'
      : avgColor > colorThreshold
      ? 'black'
      : 'white',
    secondaryColor: usePageColors
      ? 'var(--body-secondary-foreground-color)'
      : avgColor > colorThreshold
      ? 'rgb(30, 30, 30)'
      : 'rgb(180, 180, 180)',
    bgColorMult: bgColorMult,
    topColor: usePageColors
      ? 'var(--body-secondary-bg-color)'
      : `rgba(${bestColor
          .map((color) => color * (1 + bgColorMult * 2))
          .join(', ')}, ${opacity})`,
    bottomColor: usePageColors
      ? 'var(--body-secondary-bg-color)'
      : `rgba(${bestColor.map((color) => color * 1).join(', ')},  ${opacity})`,
    bgTopColor: `rgb(${bestColor
      .map((color) =>
        avgColor > lightNum ? (color * lightNum) / avgColor : color
      )
      .join(', ')})`,
    allColors,
    //`rgb(${color.map(color => (color * 130/avgColor) ** 1.1).join(", ")})`
  };
};

export const getColorData = (img) => {
  return Vibrant.from(img).getPalette();
};
