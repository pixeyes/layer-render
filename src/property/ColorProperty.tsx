import * as React from "react";
import { Color, Gradient, Row } from "@pixeyes/property";
import { GRADIENT } from "./constants";

type LayerColor = {
  color: any;
  gradient: any;
};
interface ColorPropertyProps {
  layerColors: LayerColor[];
}

const ColorProperty: React.FC<ColorPropertyProps> = ({ layerColors }) => {
  return (
    <Row>
      {layerColors.map((item, index) => {
        if (item.color) {
          return <Color key={index} color={item.color} />;
        }
        if (item.gradient) {
          return (
            <Gradient
              // @ts-ignore
              title={GRADIENT[item.gradient.type]}
              circle={item.gradient.type === "radial"}
              // @ts-ignore
              angular={D(item.gradient)}
              colorStops={item.gradient.points.map((point: any) => ({
                color: point.color,
                position: Math.round(point.position * 100) + "%",
              }))}
              key={index}
            />
          );
        }
        return null;
      })}
    </Row>
  );
};

export default ColorProperty;

function C(t: number) {
  return Math.round(100 * t) / 100;
}

export function D(t: any) {
  if (null != t.angle) return C(t.angle);
  let e = {
      x: t.from.x,
      y: t.from.y,
      x1: t.to.x,
      y1: t.to.y,
    },
    i = e.x1 - e.x,
    n = e.y1 - e.y,
    a = n / Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2)),
    s = (180 * Math.acos(a)) / Math.PI,
    o = (i > 0 ? 360 - s : s) + 180;
  return o > 360 && (o -= 360), Math.round(o);
}
