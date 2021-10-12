import * as React from "react";
import { ColorItem } from "./ColorProperty";
import { ShadowTypes } from "./constants";

type layerShadow = {
  type: "inner" | "outer";
  offsetX:number
  offsetY:number
  blurRadius:number
  spread:number
  color:any
};
interface ShadowPropertyProps {
  layerShadows: layerShadow[];
}

const ShadowProperty: React.FC<ShadowPropertyProps> = ({ layerShadows }) => {
  return (
    <div className="property-shadow property-item-warp group">
      {layerShadows.map((layerShadow, index) => (
        <div className="item" key={index}>
          <div className="title">{ShadowTypes[layerShadow.type]}</div>
          <div className="content">
            <div>
              <div className="l">偏移</div>
              <div data-title="x" className="r text">
                X: {layerShadow.offsetX}px
              </div>
              <div data-title="y" className="r text" style={{ marginLeft: 16 }}>
                Y: {layerShadow.offsetY}px
              </div>
            </div>
            <div>
              <div className="l">效果</div>
              <div data-title="x" className="r text">
                模糊: {layerShadow.blurRadius}px
              </div>
              <div data-title="y" className="r text" style={{ marginLeft: 16 }}>
                扩展: {layerShadow.spread}px
              </div>
            </div>
            <div>
              <ColorItem color={layerShadow.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShadowProperty;
