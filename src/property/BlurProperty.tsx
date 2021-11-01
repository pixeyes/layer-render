import * as React from "react";
import { BLUR_TYPES } from "./constants";
import { useContext } from "react";
import Context from "../context";
import { toUnitNB } from "../utils";

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
    <div className="property-blur property-item-warp group">
      {layerBlurs.map((layerBlur, index) => (
        <div className="item" key={index}>
          <div className="title">{BLUR_TYPES[layerBlur.type]}</div>
          <div className="content">
            <div>
              <div className="l">偏移</div>
              <div className="r text">
                {toUnitNB(layerBlur.radius, artSize!, false)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlurProperty;
