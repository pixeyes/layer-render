import * as React from "react";
import { BLUR_TYPES } from "./constants";
import { useContext } from "react";
import Context from "../context";
import { toUnitNB } from "../utils";
import { Basic, Divider, Row } from "@pixeyes/property";

type LayerBlur = {
  type: "gauss" | "background" | "action" | "radial";
  radius: number;
};

interface BlurPropertyProps {
  layerBlurs: LayerBlur[];
}

const BlurProperty: React.FC<BlurPropertyProps> = ({ layerBlurs }) => {
  const { artSize } = useContext(Context);
  return (
    <>
      <Divider />
      {layerBlurs.map((layerBlur, index) => (
        <Row key={index}>
          <Basic
            title={BLUR_TYPES[layerBlur.type] + "偏移"}
            content={toUnitNB(layerBlur.radius, artSize!, false)}
          />
        </Row>
      ))}
    </>
  );
};

export default BlurProperty;
