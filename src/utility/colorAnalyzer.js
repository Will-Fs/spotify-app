import * as Vibrant from "node-vibrant";


export const getColorInfo = color => {
    // console.log(color);
    color = color.LightVibrant.getRgb();
    const bgColorMult = 0;
    const opacity = 1;
    const avgColor = color.slice(0, 3).reduce((a, b) => a + b) / 3;
    const colorThreshold = 255;
    return (
      {
        foregroundColor: avgColor > colorThreshold ? "black" : "white",
        secondaryColor: avgColor > colorThreshold ? "rgb(30, 30, 30)" : "rgb(180, 180, 180)",
        bgColorMult: bgColorMult,
        topColor: "var(--body-secondary-bg-color)",//`rgba(${color.map(color => color * (1 + bgColorMult * 2)).join(", ")}, ${opacity})`,
        bottomColor: "var(--body-secondary-bg-color)",//`rgba(${color.map(color => color * (1)).join(", ")},  ${opacity})`,
        bgTopColor: `rgb(${color.map(color => (color * 130/avgColor) ** 1.1).join(", ")})`
      }
    );
  }

  
export const getColorData = img => {
    return Vibrant.from(img).getPalette();
}