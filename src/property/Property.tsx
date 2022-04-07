import * as React from "react";
import classNames from "classnames";
import FontProperty from "./FontProperty";
import ColorProperty from "./ColorProperty";
import { RightCloseIcon, SetIcon } from "../svgIcons";
import BordersProperty from "./BordersProperty";
import ShadowProperty from "./ShadowProperty";
import BlurProperty from "./BlurProperty";
import { useContext, useEffect, useState } from "react";
import { decodeStr } from "../utils/decodeStr";
import Context from "../context";
import { toUnitNB } from "../utils";
import { Basic, ConfigProvider, Container, Row } from "@pixeyes/property";
import Draggable from "react-draggable";
import "@pixeyes/property/dist/@pixeyes/property.css";
import Handle from "../icons/Handle";
export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
  value: string;
};
export type TGradient = {
  from: { x: number; y: number };
  points: any[];
  to: { x: number; y: number };
  type: "linear" | "radial" | "circle" | "diamond";
};
export type Font = {
  content: string;
  size: number;
  spacing: string;
  align: "left" | "right";
  color: Color;
  verticalAlignment: "top" | "middle" | "bottom";
  lineHeight: number;
  family: string;
  style: "Medium";
  paragraphSpacing?: number;
};
type Frame = {
  x: number;
  y: number;
  _x: number;
  _y: number;
  width: number;
  height: number;
  _width: number;
  _height: number;
  rx: number;
  ry: number;
};
type Style = {
  opacity: 1;
  radius: number[];
};
export type Layer = {
  name: string;
  type: string;
  sharedStyle: null;
  font: Font;
  id: 3;
  frame: Frame;
  style: Style;
  idx: 3;
  _rect: {
    x: 210;
    y: 158;
    width: 192;
    height: 32;
    halfWidth: 96;
    halfHeight: 16;
    centerX: 306;
    centerY: 174;
  };
};
interface PropertyProps {
  current: Layer;
  width: number;
  height: number;
  platform: string;
  ratio: number;
  onModalVisibleChange: () => void;
}
const getLayerAttr = (style: any, key: any) =>
  style && style[key] ? style[key] : [];
const Property: React.FC<PropertyProps> = ({
  current,
  platform,
  ratio,
  width,
  height,
  onModalVisibleChange,
}) => {
  const { artSize, colorType, onChangeColorType } = useContext(Context);
  const layerColors = getLayerAttr(current.style, "fills");
  const layerBorders = getLayerAttr(current.style, "borders");
  const layerShadows = getLayerAttr(current.style, "shadows");
  const layerBlurs = getLayerAttr(current.style, "blurs");
  const [visible, setVisible] = useState<boolean>(true);
  const unitResult =
    toUnitNB(width, artSize!) + " x " + toUnitNB(height, artSize!);
  useEffect(() => {
    if (!current) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [current]);
  return (
    <Draggable handle=".drag-handle">
      <div
        className={classNames("property right rel-property_index", {
          close: !visible || !current,
          open: !(!visible || !current),
        })}
      >
        <div className="page-design-info">
          <div className="left">
            <Handle />
            <div className="left_title">{decodeStr(current.name)}</div>
          </div>

          <div className="close_icon">
            <RightCloseIcon onClick={() => setVisible(false)} />
          </div>
        </div>
        <div className="page-unit-info-wrap">
          <div className="page-unit-info">
            <div className="left_title">
              <span title="iOS@1x" className="unit_name overflow-text">
                {platform}
                {platform === "iOS" && (
                  <span className="unit_device">@{ratio}x</span>
                )}
              </span>
            </div>
            <div className="right_title">
              <span className="unit_result overflow-text">{unitResult}</span>
              <SetIcon onClick={onModalVisibleChange} />
            </div>
          </div>
        </div>
        <div className="property-base-wrap rel-property_content">
          <div
            className="content scrollbar"
            style={{ maxHeight: window.innerHeight - 280 }}
          >
            <ConfigProvider
              colorType={colorType}
              changeColorType={onChangeColorType}
            >
              <Container>
                <Row>
                  <Basic
                    title="位置"
                    subTitle="X"
                    content={toUnitNB(current.frame.x, artSize!)}
                  />
                  <Basic
                    title=""
                    subTitle="Y"
                    content={toUnitNB(current.frame.y, artSize!)}
                  />
                  <Basic
                    title="大小"
                    subTitle="宽"
                    content={toUnitNB(current.frame.width, artSize!)}
                  />
                  <Basic
                    title=""
                    subTitle="高"
                    content={toUnitNB(current.frame.height, artSize!)}
                  />
                  {current.style?.opacity && (
                    <Basic
                      title="不透明度"
                      content={current.style.opacity * 100 + "%"}
                    />
                  )}
                  {current.style?.radius && (
                    <Basic
                      title="圆角"
                      content={current.style.radius
                        .map((i) => toUnitNB(i, artSize!))
                        .join(" ")}
                    />
                  )}
                </Row>
                {(current.style || current.font) && (
                  <>
                    {current.font && <FontProperty font={current.font} />}
                    {layerColors.length > 0 && (
                      <ColorProperty layerColors={layerColors} />
                    )}
                    {layerBorders.length > 0 && (
                      <BordersProperty layerBorders={layerBorders} />
                    )}
                    {layerShadows.length > 0 && (
                      <ShadowProperty layerShadows={layerShadows} />
                    )}
                    {layerBlurs.length > 0 && (
                      <BlurProperty layerBlurs={layerBlurs} />
                    )}
                  </>
                )}
              </Container>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Property;
