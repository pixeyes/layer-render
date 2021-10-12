import * as React from "react";
import { isEqual } from "lodash-es";
import {
  getLayersByPosition,
  MAX_SCALE,
  MIN_SCALE,
  WHEEL_HOLD,
  WHEEL_SCALE_STEP,
  ZOOM_SCALE_STEP,
} from "../utils";
import {
  toUnit,
  computeShowMarginTopStyle,
  computeShowMarginBottomStyle,
  computeShowMarginRightStyle,
  computeShowMarginLeftStyle,
} from "./renderUtils";
import "./canvas.scss";
import Operation from "../Operation";
import Property, { Layer } from "../property/Property";

import ControlType from "../RenderComponents/ControlType";
import "./canvas.scss";

export interface LayerRenderProps {
  data: any;
  goNext?: () => void;
}

interface State {
  current: Layer & any;
  hoverLayer: any;
  top: any;
  right: any;
  bottom: any;
  left: any;
  scale: number;
  x: number;
  y: number;
  data: any;
}

class LayerRender extends React.Component<LayerRenderProps, State> {
  imageRef: any;
  currentRef: any;
  distanceRef: any;
  marginRef: any;
  canvas: any;
  context: any;
  layers: any;
  current: any;
  tempX: number;
  tempY: number;
  offsetX: number;
  offsetY: number;
  moving: boolean;

  constructor(props: LayerRenderProps) {
    super(props);
    this.imageRef = React.createRef();
    this.distanceRef = React.createRef();
    this.marginRef = React.createRef();

    this.tempX = 0;
    this.tempY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.moving = false;

    this.state = {
      current: null,
      hoverLayer: null,
      top: null,
      right: null,
      bottom: null,
      left: null,
      scale: 1,
      x: 0,
      y: 0,
      data: props.data,
    };
    //this.layers = props.data.data.info;
  }
  // @ts-ignore
  validLayers = () => {
    const t = this.props.data.data.info;
    const e = this.state;
    t.forEach(function (t: any) {
      t.frame.rx = t.frame.x + t.frame.width;
        t.frame.ry = t.frame.y + t.frame.height;
      const i = e.scale * t.frame.x,
        n = e.scale * t.frame.y,
        a = e.scale * t.frame.width,
        s = e.scale * t.frame.height,
        o = a / 2,
        r = s / 2;
      t._rect = {
        x: i,
        y: n,
        width: a,
        height: s,
        halfWidth: o,
        halfHeight: r,
        centerX: i + o,
        centerY: n + r,
      };
    });
    return t;
  };

  onWhiteSpaceClick = () => {
    this.setState({
      current: null,
    });
  };

  async componentDidMount() {
    //this.buildCanvas();
    window.addEventListener("resize", this.onResize);
    //document.addEventListener("click", this.onWhiteSpaceClick);

    console.log("emitEvent getContentCurrentLayer");
  }

  componentDidUpdate(prevProps: Readonly<LayerRenderProps>) {
    if (prevProps.data.id !== this.props.data.id) {
      this.setState({
        current: null,
        hoverLayer: null,
        top: null,
        right: null,
        bottom: null,
        left: null,
        scale: 1,
        x: 0,
        y: 0,
        data: this.props.data,
      });
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    //document.removeEventListener("click", this.onWhiteSpaceClick);
  }

  onResize = () => {};

  getPosition = (): { x: number; y: number } => {
    const { scale, data, x, y } = this.state;
    const canvasWidth = window.innerWidth;
    //const canvasHeight = window.innerHeight;
    // @ts-ignore
    const imgWidth = data.width * data.artboard_scale;
    //const imgHeight = data.height * data.artboard_scale;
    return {
      x: (canvasWidth - imgWidth * scale) / 2 - x,
      y: 0 - y,
    };
  };

  buildCanvas = () => {
    const { scale, data } = this.state;
    const imgWidth = data.width * 4;
    const imgHeight = data.height * 4;
    const { x, y } = this.getPosition();
    this.canvas = this.imageRef.current;
    const ctx = this.canvas.getContext("2d");
    //this.context = ctx;
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(x, y, imgWidth * scale, imgHeight * scale);
      ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };
    img.src =
      "//bimg1-local.jd.com/b/1cd06af6c7d8569560d06530d740de3a6d04b54bb2daed76e067b9393d0eed96.png";
    //this.context.strokeStyle = 'rgba(255,255,255,0)';
    //this.context.lineWidth = 1;
    /*var img = new Image();
const that = this
img.onload = function(){
that.context.drawImage(img,0,0);
}
img.src = 'http://bimg1-local.jd.com/b/1cd06af6c7d8569560d06530d740de3a6d04b54bb2daed76e067b9393d0eed96.png';*/
    /*const {info} = JSON.parse(pageInfo.data.data)
//left":0,"top":0,"width":750,"height":1334
info.forEach(item => {
this.drawRect(item.left, item.top, item.width, item.height)
this.context.stroke();
})*/
    //this.drawRect( 50,50,50,50)
  };

  /*drawRect = (x: number, y: number, w: number, h: number) => {
    this.context.beginPath();
    this.context.rect(x, y, w, h);
  };*/
  getCanvasPoint = (x: number, y: number) => {
    const canvasOffset = this.imageRef.current.getBoundingClientRect();
    return {
      x: x - canvasOffset.left,
      y: y - canvasOffset.top,
    };
  };

  onMouseMove = (e: MouseEvent) => {
    const { data } = this.state;
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    const currentHoverLayer = getLayersByPosition(this.validLayers(), point);

    this.setState({
      hoverLayer: currentHoverLayer,
    });
    if (this.state.current && currentHoverLayer) {
      this.setState({
        top: this.showMarginTopStyle(),
        right: this.showMarginRightStyle(),
        bottom: this.showMarginBottomStyle(),
        left: this.showMarginLeftStyle(),
      });
    }

    if (this.moving) {
      this.offsetX += e.clientX - this.tempX;
      this.offsetY += e.clientY - this.tempY;
      const x = this.state.x - this.offsetX;
      const y = this.state.y - this.offsetY;

      //x = Math.min(x,this.state.data.width*this.state.scale*4-20)
      this.setState({
        x:
          x > 0
            ? Math.min(data.width * this.state.scale - WHEEL_HOLD, x)
            : Math.max(-(data.width * this.state.scale - WHEEL_HOLD), x),
        y:
          y > 0
            ? Math.min(data.height * this.state.scale - WHEEL_HOLD, y)
            : Math.max(-(window.innerHeight - WHEEL_HOLD), y),
      });
      this.offsetX = this.offsetY = 0;
      this.tempX = e.clientX;
      this.tempY = e.clientY;
    }
  };

  onMouseleave = () => {
    this.setState({
      hoverLayer: null,
    });
  };

  onMouseUp = () => {
    this.moving = false;
  };

  onMouseDown = async (e: MouseEvent) => {
    this.moving = true;
    this.tempX = e.clientX;
    this.tempY = e.clientY;
    this.offsetX = this.offsetY = 0;

    const { current: currentLayer } = this.state;
    e.stopPropagation();
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    const layers = getLayersByPosition(
      this.validLayers(),
      point,
      true
    ) as any[];
    let index = 0;
    if (currentLayer != null) {
      index = layers.findIndex((t) => t.id === currentLayer.id) + 1;
    }
    if (index >= layers.length) {
      index = 0;
    }
    index = Math.min(index, layers.length - 1);
    const current = layers[index];
    this.setState({
      current,
    });
  };

  // @ts-ignore

  showMarginTopStyle = () => {
    let { current, hoverLayer: hoverItem } = this.state;
    if (!current || !hoverItem) {
      return null;
    }
    current = current.frame;
    hoverItem = hoverItem.frame;
    return computeShowMarginTopStyle(current, hoverItem);
  };

  showMarginBottomStyle = () => {
    let { current, hoverLayer: hoverItem } = this.state;
    if (!current || !hoverItem) {
      return null;
    }
    current = current.frame;
    hoverItem = hoverItem.frame;
    return computeShowMarginBottomStyle(current, hoverItem);
  };

  showMarginRightStyle = () => {
    let { current, hoverLayer: hoverItem } = this.state;
    if (!current || !hoverItem) {
      return null;
    }
    current = current.frame;
    hoverItem = hoverItem.frame;

    return computeShowMarginRightStyle(current, hoverItem);
  };

  showMarginLeftStyle = () => {
    let { current, hoverLayer: hoverItem } = this.state;
    if (!current || !hoverItem) {
      return null;
    }
    current = current.frame;
    hoverItem = hoverItem.frame;

    return computeShowMarginLeftStyle(current, hoverItem);
  };

  toRatioPX = (value: any) => {
    return value ? toUnit(value, "", this.state.scale) : null;
  };
  showDistanceTopStyle = () => {
    const marginData = this.state.top;
    if (!marginData) return null;
    let left, width, top;
    const current = this.state.current.frame;
    const hoverItem = this.state.hoverLayer.frame;

    //同时在 current 和 hoverItem 里
    if (
      marginData.left >= current.x &&
      marginData.left <= current.x + current.width &&
      marginData.left >= hoverItem.x &&
      marginData.left <= hoverItem.x + hoverItem.width
    ) {
      return null;
    }

    left = marginData.left;
    // eslint-disable-next-line prefer-const
    top = marginData.top;

    // 在 current
    if (
      marginData.left >= current.x &&
      marginData.left <= current.x + current.width
    ) {
      if (hoverItem.x > marginData.left) {
        width = hoverItem.x - marginData.left;
      } else {
        width = marginData.left - (hoverItem.x + hoverItem.width);
        left = hoverItem.x + hoverItem.width;
      }
    } else {
      // 在 hoverItem
      if (marginData.left > current.x) {
        left = current.x + current.width;
        width = marginData.left - left;
      } else {
        width = current.x - left;
      }
    }

    return this.toRatioPX({ left, width, top });
  };
  showDistanceBottomStyle = () => {
    const marginData = this.state.bottom;
    if (!marginData) return null;
    let left, width, top;
    const current = this.state.current.frame;
    const hoverItem = this.state.hoverLayer.frame;
    //同时在 current 和 hoverItem 里
    if (
      marginData.left >= current.x &&
      marginData.left <= current.x + current.width &&
      marginData.left >= hoverItem.x &&
      marginData.left <= hoverItem.x + hoverItem.width
    ) {
      return null;
    }
    if (current.y + current.height === hoverItem.y + hoverItem.height) {
      return null;
    }

    left = marginData.left;
    // eslint-disable-next-line prefer-const
    top = marginData.top + marginData.height;

    // 在 current
    if (
      marginData.left >= current.x &&
      marginData.left <= current.x + current.width
    ) {
      if (hoverItem.x > marginData.left) {
        width = hoverItem.x - marginData.left;
      } else {
        width = marginData.left - (hoverItem.x + hoverItem.width);
        left = hoverItem.x + hoverItem.width;
      }
    } else {
      // 在 hoverItem
      if (marginData.left > current.x + current.width) {
        width = marginData.left - (current.x + current.width);
        left = current.x + current.width;
      } else {
        width = current.x - marginData.left;
      }
    }

    return this.toRatioPX({ left, width, top });
  };
  showDistanceRightStyle = () => {
    const marginData = this.state.right;
    if (!marginData) return null;
    let left, height, top;
    const current = this.state.current.frame;
    const hoverItem = this.state.hoverLayer.frame;
    //同时在 current 和 hoverItem 里
    if (
      marginData.top >= current.y &&
      marginData.top <= current.y + current.height &&
      marginData.top >= hoverItem.y &&
      marginData.top <= hoverItem.y + hoverItem.height
    ) {
      return null;
    }

    // 线在 current 里
    if (
      marginData.top > current.y &&
      marginData.top < current.y + current.height
    ) {
      if (marginData.top > hoverItem.y) {
        top = hoverItem.y + hoverItem.height;
        height = marginData.top - top;
      } else {
        top = marginData.top;
        height = hoverItem.y - top;
      }
    } //线在 hoverItem 里
    else if (
      marginData.top > hoverItem.y &&
      marginData.top < hoverItem.y + hoverItem.height
    ) {
      if (marginData.top > current.y) {
        top = current.y + current.height;
        height = marginData.top - top;
      } else {
        top = marginData.top;
        height = current.y - top;
      }
    }

    // eslint-disable-next-line prefer-const
    left = marginData.left + marginData.width - 1;

    return this.toRatioPX({ left, height, top });
  };
  showDistanceLeftStyle = () => {
    const marginData = this.state.left;
    if (!marginData) return null;
    let left, height, top;
    const current = this.state.current.frame;
    const hoverItem = this.state.hoverLayer.frame;
    //同时在 current 和 hoverItem 里
    if (
      marginData.top >= current.y &&
      marginData.top <= current.y + current.height &&
      marginData.top >= hoverItem.y &&
      marginData.top <= hoverItem.y + hoverItem.height
    ) {
      return null;
    }

    // 线在 current 里
    if (
      marginData.top > current.y &&
      marginData.top < current.y + current.height
    ) {
      if (marginData.top > hoverItem.y) {
        top = hoverItem.y + hoverItem.height;
        height = marginData.top - top;
      } else {
        top = marginData.top;
        height = hoverItem.y - top;
      }
    } //线在 hoverItem 里
    else if (
      marginData.top > hoverItem.y &&
      marginData.top < hoverItem.y + hoverItem.height
    ) {
      if (marginData.top > current.y) {
        top = current.y + current.height;
        height = marginData.top - top;
      } else {
        top = marginData.top;
        height = current.y - top;
      }
    }

    // eslint-disable-next-line prefer-const
    left = marginData.left;
    return this.toRatioPX({ left, height, top });
  };

  zoomIn = () => {
    //this.setScale(zoomInNext(this.state.scale));
    this.setScale(this.state.scale + ZOOM_SCALE_STEP);
  };

  zoomOut = () => {
    //this.setScale(zoomOutNext(this.state.scale));
    this.setScale(this.state.scale - ZOOM_SCALE_STEP);
  };

  zoomToPrimitive = () => {
    this.setScale(1);
  };
  zoomNext = () => {
    //this.props.goNext();
  };
  setScale = (scale = 1, e?: any) => {
    // @ts-ignore

    const toScale =
      1 *
      // @ts-ignore
      parseFloat(Math.max(Math.min(scale, MAX_SCALE), MIN_SCALE)).toFixed(2);
    const o = this.getPosition();
    const c = e
      ? e
      : {
          x: window.innerWidth / 2 / this.state.data.resolution,
          y: window.innerHeight / 2 / this.state.data.resolution,
        };
    // c.x = Math.max(o.x, Math.min(c.x, o.x + o.width)),
    // c.y = Math.max(o.y, Math.min(c.y, o.y + o.height));
    console.log(o);
    console.log(c);
    this.setState({
      scale: toScale,
    });
  };

  onWheel = (e: WheelEvent) => {
    const { data } = this.state;

    if (e.ctrlKey) {
      this.setScale(
        this.state.scale +
          (e.deltaY > 0 ? -WHEEL_SCALE_STEP : WHEEL_SCALE_STEP),
        {
          x: e.clientX,
          y: e.clientY,
        }
      );
    } else {
      const x = this.state.x + e.deltaX;
      const y = this.state.y + e.deltaY;

      //x = Math.min(x,this.state.data.width*this.state.scale*4-20)
      this.setState({
        x:
          x > 0
            ? Math.min(data.width * this.state.scale - WHEEL_HOLD, x)
            : Math.max(-(data.width * this.state.scale - WHEEL_HOLD), x),
        y:
          y > 0
            ? Math.min(data.height * this.state.scale - WHEEL_HOLD, y)
            : Math.max(-(window.innerHeight - WHEEL_HOLD), y),
      });
    }
  };

  render() {
    const { current, hoverLayer, scale, data } = this.state;
    // console.log("current", current);
    const { x, y } = this.getPosition();
    const top = this.toRatioPX(this.showMarginTopStyle());
    const bottom = this.toRatioPX(this.showMarginBottomStyle());
    const left = this.toRatioPX(this.showMarginLeftStyle());
    const right = this.toRatioPX(this.showMarginRightStyle());
    const showDistance = !(left && right && top && bottom);
    //const data = JSON.parse(pageInfo.data.data)
    const style = {
      border: "1px solid #d3d3d3",
      backgroundImage: `url('https://bimg1-local.jd.com/${this.props.data.image}')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${x}px ${y}px`,
      backgroundSize: `${scale * data.width * data.artboard_scale}px ${
        scale * data.height * data.artboard_scale
      }px`,
    };

    const currentStyle: React.CSSProperties = current
      ? {
          width: toUnit(current.frame.width, "px", scale),
          height: toUnit(current.frame.height, "px", scale),
          left: toUnit(current.frame.x, "px", scale),
          top: toUnit(current.frame.y, "px", scale),
          position: "absolute",
          zIndex: 1,
          border: "1px solid #f53914",
        }
      : {};

    return (
      <>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "relative",
            overflow:'hidden'
          }}
          // @ts-ignore
          onWheel={this.onWheel}
        >
          <canvas
            className="canvas"
            ref={this.imageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={style}
            onClick={this.onWhiteSpaceClick}
          >
            123
          </canvas>
          <div
            className="wrap"
            // @ts-ignore
            onMouseMove={this.onMouseMove}
            // @ts-ignore
            onMouseDown={this.onMouseDown}
            onMouseLeave={this.onMouseleave}
            onMouseUp={this.onMouseUp}
            style={{
              left: x,
              top: y,
              width: data.width * scale * data.artboard_scale,
              height: data.height * scale * data.artboard_scale,
            }}
          >
            {(current && !hoverLayer) ||
            (current && isEqual(hoverLayer, current)) ? (
              <div
                className="border"
                style={currentStyle}
                data-width={current ? current.frame.width + "px" : ""}
                data-height={current ? current.frame.height + "px" : ""}
              />
            ) : (
              current && <div className="current-item" style={currentStyle} />
            )}

            {hoverLayer && (
              <div
                className="hover-item"
                style={this.toRatioPX({
                  left: hoverLayer.frame.x,
                  top: hoverLayer.frame.y,
                  width: hoverLayer.frame.width,
                  height: hoverLayer.frame.height,
                })}
              />
            )}
            {hoverLayer && !current && (
              <div className="line">
                <div
                  className="x"
                  style={this.toRatioPX({
                    left: hoverLayer.frame.x,
                    width: hoverLayer.frame.width,
                  })}
                />
                <div
                  className="y"
                  style={this.toRatioPX({
                    top: hoverLayer.frame.y,
                    height: hoverLayer.frame.height,
                  })}
                />
              </div>
            )}

            {current && hoverLayer && !isEqual(current, hoverLayer) && (
              <>
                {showDistance && (
                  <div className="distance">
                    {this.showDistanceTopStyle() && (
                      <div
                        className="top"
                        style={this.showDistanceTopStyle()}
                      />
                    )}
                    {this.showDistanceRightStyle() && (
                      <div
                        className="right"
                        style={this.showDistanceRightStyle()}
                      />
                    )}
                    {this.showDistanceBottomStyle() && (
                      <div
                        className="bottom"
                        style={this.showDistanceBottomStyle()}
                      />
                    )}
                    {this.showDistanceLeftStyle() && (
                      <div
                        className="left"
                        style={this.showDistanceLeftStyle()}
                      />
                    )}
                  </div>
                )}
                <div ref={this.marginRef} className="margin">
                  {top && (
                    <div className="top" style={top}>
                      {top.value && (
                        <div
                          className="info"
                          data-value={toUnit(top.value, "px")}
                        />
                      )}
                    </div>
                  )}
                  {right && (
                    <div className="right" style={right}>
                      {right.value && (
                        <div
                          className="info"
                          data-value={toUnit(right.value, "px")}
                        />
                      )}
                    </div>
                  )}

                  {bottom && (
                    <div className="bottom" style={bottom}>
                      {bottom.value && (
                        <div
                          className="info"
                          data-value={toUnit(bottom.value, "px")}
                        />
                      )}
                    </div>
                  )}
                  {left && (
                    <div className="left" style={left}>
                      {left.value && (
                        <div
                          className="info"
                          data-value={toUnit(left.value, "px")}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <ControlType />
        <Operation
          scale={scale}
          zoomIn={this.zoomIn}
          zoomOut={this.zoomOut}
          zoomToPrimitive={this.zoomToPrimitive}
          zoomNext={this.zoomNext}
        />
        {current && (
          <Property current={current} width={data.width} height={data.height} />
        )}
      </>
    );
  }
}

// @ts-ignore
export default LayerRender;
