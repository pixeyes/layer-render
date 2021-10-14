import * as React from "react";
import { useState } from "react";
import { Color, TGradient } from "./Property";
import { toColor } from "../utils/colorUtil";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { GRADIENT, jo } from "./constants";
type LayerColor = {
    color:any,
    gradient:any
}
interface ColorPropertyProps {
  layerColors: LayerColor[];
}

const ColorProperty: React.FC<ColorPropertyProps> = ({ layerColors }) => {
  return (
    <div className="property-color group">
      {layerColors.map((item, index) => {
        if (item.color) {
          return <ColorItem key={index} color={item.color} />;
        }
        if (item.gradient) {
          return <Gradient gradient={item.gradient} key={index} />;
        }
        return null;
      })}
    </div>
  );
};

export default ColorProperty;

interface ColorItemProps {
  color: Color;
}

export const ColorItem: React.FC<ColorItemProps> = ({ color }) => {
  return (
    <div className="property-color-item relay-common-dropdown-warp">
      <div className="color-wrap">
        <div className="l">颜色</div>
        <ColorHint color={color} />
      </div>
    </div>
  );
};

function C(t:number) {
  return Math.round(100 * t) / 100;
}

function D(t:any) {
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
function toDeg(t:any) {
  return D(t) + "deg";
}

export const Gradient: React.FC<{ gradient: TGradient }> = ({ gradient }) => {
  return (
    <div className="property-gradient-item relay-common-dropdown-warp">
      <div className="color-wrap">
        <div className="l">颜色</div>
        <div className="r">
          <div className="r-box title-tip">
            <span className="title">{GRADIENT[gradient.type]}</span>
            <div>, {gradient.type === "radial" ? "圆" : toDeg(gradient)}</div>
          </div>
          <div className="r-box">
            <div
              className="color-hint"
              style={{
                background: `linear-gradient(${gradient.points
                  .map((point) => point.color.value)
                  .join(" , ")})`,
              }}
            ></div>
            <div className="color-item">
              {gradient.points.map((point, index) => (
                <ColorHint key={index} color={point.color} />
              ))}
            </div>
            <div className="line">
              <i
                className="top"
                style={{ backgroundColor: `rgba(190, 149, 255, 0.24)` }}
              ></i>
              <span></span>
              <i
                className="bottom"
                style={{ backgroundColor: ` rgba(190, 149, 255, 0.77)` }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ColorHint:React.FC<{color:any}> = ({ color }) => {
  const [colorType, setColorType] = useState("hex");

  // @ts-ignore
    const menu = (
    <Menu>
      {jo.map((item) => (
        <Menu.Item
          key={item}
          className="color-type"
          onClick={() => setColorType(item.toLowerCase())}
        >
          <div>{item}</div>
          <div>

            {
                // @ts-ignore
                toColor(color)[item.toLowerCase()].toString().toUpperCase()
            }
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div className="r color-combo">
      <div className="color-hint" style={{ background: color.value }} />
      <div className="color-text overflow-text">
        {
            // @ts-ignore
             toColor(color)[colorType].toString().toUpperCase()
        }
      </div>
      {colorType === "hex" && (
        <div className="percent-text">{Math.round(100 * color.a)}%</div>
      )}
      <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
        <a className="ant-dropdown-link">
          <DownOutlined style={{ color: "#494F5C" }} />
        </a>
      </Dropdown>
    </div>
  );
};
