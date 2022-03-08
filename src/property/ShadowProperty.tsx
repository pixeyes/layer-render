import * as React from "react";
import { ShadowTypes } from "./constants";
import { useContext } from "react";
import Context from "../context";
import { toUnitNB } from "../utils";
import {Basic, Color, Divider, Row} from "@pixeyes/property";

type layerShadow = {
  type: "inner" | "outer";
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spread: number;
  color: any;
};
interface ShadowPropertyProps {
  layerShadows: layerShadow[];
}

const ShadowProperty: React.FC<ShadowPropertyProps> = ({ layerShadows }) => {
  const { artSize } = useContext(Context);
  return (
    <>
      <Divider />
      {layerShadows.map((layerShadow, index) => (
        <Row key={index}>
          <Basic
            title={ShadowTypes[layerShadow.type] + "偏移"}
            subTitle="X"
            content={toUnitNB(layerShadow.offsetX, artSize!, false)}
          />
          <Basic
            title=""
            subTitle="Y"
            content={toUnitNB(layerShadow.offsetY, artSize!, false)}
          />
          <Basic
            title="模糊"
            subTitle=""
            content={toUnitNB(layerShadow.blurRadius, artSize!, false)}
          />
          <Basic
            title="扩展"
            subTitle=""
            content={toUnitNB(layerShadow.spread, artSize!, false)}
          />
          <Color color={layerShadow.color} />
        </Row>
      ))}
    </>
  );
};

export default ShadowProperty;
