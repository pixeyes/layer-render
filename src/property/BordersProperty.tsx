import * as React from "react";
import { Border_Types, GRADIENT } from "./constants";
import { toUnitNB } from "../utils";
import { useContext } from "react";
import Context from "../context";
import { D } from "./ColorProperty";
import { Basic, Color, Divider, Gradient, Row } from "@pixeyes/property";

interface BordersPropertyProps {
  layerBorders: {
    color: any;
    gradient: any;
    thickness: number;
    type: "inner" | "center" | "outer";
  }[];
}

const BordersProperty: React.FC<BordersPropertyProps> = ({ layerBorders }) => {
  const { artSize } = useContext(Context);
  return (
    <>
      <Divider />
      {layerBorders.map((layerBorder, index) => (
        <Row key={index}>
          <Basic
            title={Border_Types[layerBorder.type] + "线型"}
            content={Border_Types[layerBorder.type]}
          />
          <Basic
            title="粗细"
            content={toUnitNB(layerBorder.thickness, artSize!, false)}
          />
          {layerBorder.color && <Color color={layerBorder.color} />}
          {layerBorder.gradient && (
            <Gradient
              // @ts-ignore
              title={GRADIENT[layerBorder.gradient.type]}
              circle={layerBorder.gradient.type === "radial"}
              // @ts-ignore
              angular={D(layerBorder.gradient)}
              colorStops={layerBorder.gradient.points.map((point: any) => ({
                color: point.color,
                position: point.position * 100 + "%",
              }))}
              key={index}
            />
          )}
        </Row>
      ))}
    </>
  );
};

export default BordersProperty;
