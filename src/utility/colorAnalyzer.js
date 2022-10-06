import * as Vibrant from "node-vibrant";

const usePageColors = true;
const colorThreshold = 255;
const bgColorMult = 0;
const opacity = 1;

export const getColorInfo = color => {
    // console.log(color);
    color = color.LightVibrant.getRgb();
    const avgColor = color.slice(0, 3).reduce((a, b) => a + b) / 3;
    return (
      {
        foregroundColor: avgColor > colorThreshold ? "black" : "white",
        secondaryColor: avgColor > colorThreshold ? "rgb(30, 30, 30)" : "rgb(180, 180, 180)",
        bgColorMult: bgColorMult,
        topColor: usePageColors ? "var(--body-secondary-bg-color)" : `rgba(${color.map(color => color * (1 + bgColorMult * 2)).join(", ")}, ${opacity})`,
        bottomColor: usePageColors ? "var(--body-secondary-bg-color)" : `rgba(${color.map(color => color * (1)).join(", ")},  ${opacity})`,
        bgTopColor: `rgb(${color.map(color => (color * 130/avgColor) ** 1.1).join(", ")})`
      }
    );
  }

  
export const getColorData = img => {
    return Vibrant.from(img).getPalette();
}