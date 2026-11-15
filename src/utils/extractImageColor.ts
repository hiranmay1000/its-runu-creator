import { Vibrant } from "node-vibrant/browser";

export const extractImageColors = async (imageUrl: string) => {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    const vibrant =
      palette.Vibrant?.hex || palette.LightVibrant?.hex || "#e9b5bd";

    const lightVibrant =
      palette.LightVibrant?.hex || palette.Vibrant?.hex || "#f6d9d3";

    const darkVibrant =
      palette.DarkVibrant?.hex || palette.Vibrant?.hex || "#8d3e4f";

    return {
      // Bright, colorful background
      background: palette.LightVibrant?.hex || vibrant,

      // Soft but colorful decorative glow
      sun: lightVibrant,

      // Rich, saturated accent
      accent: darkVibrant,
    };
  } catch (error) {
    console.error("Color extraction failed:", error);

    return {
      background: "#f3c1d0",
      sun: "#ffe0dc",
      accent: "#c04469",
    };
  }
};
