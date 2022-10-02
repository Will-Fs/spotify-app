import * as Vibrant from "node-vibrant";


export const getColorInfo = color => {
    console.log(color);
    color = color.LightVibrant.getRgb();
    const bgColorMult = 0.3;
    const avgColor = color.slice(0, 3).reduce((a, b) => a + b) / 3;
    return (
      {
        foregroundColor: avgColor > 120 ? "black" : "white",
        bgColorMult: bgColorMult,
        topColor: `rgb(${color.map(color => color * (1 + bgColorMult * 2)).join(", ")})`,
        bottomColor: `rgb(${color.map(color => color * (1 - bgColorMult / 3)).join(", ")})`,
        bgTopColor: `rgb(${color.map(color => (color * 130/avgColor) ** 1.1).join(", ")})`
      }
    );
  }

  
export const getColorData = img => {
    return Vibrant.from(img).getPalette();
}