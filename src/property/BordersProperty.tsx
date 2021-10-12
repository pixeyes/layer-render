import * as React from "react";
import { Border_Types } from "./constants";
import {
  ColorItem,
  Gradient,
} from "./ColorProperty";
import { Color } from "./Property";

interface BordersPropertyProps {
  layerBorders: {
    color: Color;
    gradient: any;
    thickness: number;
    type: "inner" | "center" | "outer";
  }[];
}

const BordersProperty: React.FC<BordersPropertyProps> = ({ layerBorders }) => {
  return (
    <div className="property-border property-item-warp group">
      {layerBorders.map((layerBorder, index) => (
        <div className="item" key={index}>
          <div className="title">{Border_Types[layerBorder.type]}</div>
          <div className="content">
            <div>
              <div className="l">粗细</div>
              <div className="r text">{layerBorder.thickness}px</div>
            </div>
            <div>
              {layerBorder.color && <ColorItem color={layerBorder.color} />}
              {layerBorder.gradient && (
                <Gradient gradient={layerBorder.gradient} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BordersProperty;
