import {ColorRgb, Option} from "@/types/common.types";

// RED, GREEN, BLUE represent the percentual share of each
// color's luminance in the luminance scale of the color spectrum
const RED = 0.2126;
const GREEN = 0.7152
const BLUE = 0.0722;
const GAMMA = 2.4;


export function hexToRgb(hexValue: string): Option<[number, number, number]> {
  //regex to define the r,g,b parts of the hex color string
  const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/.exec(hexValue);
  return result ? [
    parseInt(result[1],16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

export function rgbToHex(color: ColorRgb): string {
  const [r,g,b] = color;
  return "#" + r.toString(16) + g.toString(16) + b.toString(16);
}

// mathematics-based method to extract luminance from a rgb color
// converts the color to grayscale and returns the luminance
// in a decimal percentage
export function getLuminance(color: ColorRgb) {
  const a = [...color].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

// get the contrast between two rgb colors
// for good contrast you should aim at minimum 4.5
export function getContrast(color1: ColorRgb, color2: ColorRgb): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// converts a string into a unique hash
// and extracts a color from that hash in hex notation
export function getHexColorFromText(value: string) {
  let hash = 0;
  value.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  let color = "#";
  for(let i = 0; i < 3; i++) {
    const cValue = (hash >> (i * 8)) & 0xff;
    color += cValue.toString(16).padStart(2, "0");
  }
  return color;
}