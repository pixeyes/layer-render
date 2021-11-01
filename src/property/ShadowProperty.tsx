import * as React from "react";
import { ColorItem } from "./ColorProperty";
import { ShadowTypes } from "./constants";
import {useContext} from "react";
import Context from "../context";
import {toUnitNB} from "../utils";

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
  const { artSize } = useContext(Context);
  return (
    <div className="property-shadow property-item-warp group">
      {layerShadows.map((layerShadow, index) => (
        <div className="item" key={index}>
          <div className="title">{ShadowTypes[layerShadow.type]}</div>
          <div className="content">
            <div>
              <div className="l">偏移</div>
              <div data-title="x" className="r text">
                X: {toUnitNB(layerShadow.offsetX, artSize!, false)}
              </div>
              <div data-title="y" className="r text" style={{ marginLeft: 16 }}>
                Y: {toUnitNB(layerShadow.offsetY, artSize!, false)}
              </div>
            </div>
            <div>
              <div className="l">效果</div>
              <div data-title="x" className="r text">
                模糊: {toUnitNB(layerShadow.blurRadius, artSize!, false)}
              </div>
              <div data-title="y" className="r text" style={{ marginLeft: 16 }}>
                扩展: {toUnitNB(layerShadow.spread, artSize!, false)}
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
