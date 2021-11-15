// @ts-ignore
import { Color } from "./colz";

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export const toColor = (color: RGBA) =>
  new Color(color.r, color.g, color.b, color.a);
