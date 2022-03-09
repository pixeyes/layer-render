import * as React from "react";
import { isEqual } from "lodash-es";
import {
  getLayersByPosition,
  MAX_SCALE,
  MIN_SCALE,
  toUnitNB,
  //WHEEL_HOLD,
  WHEEL_SCALE_STEP,
  ZOOM_SCALE_STEP,
} from "../utils";
import {
  computeShowMarginBottomStyle,
  computeShowMarginLeftStyle,
  computeShowMarginRightStyle,
  computeShowMarginTopStyle,
  toUnit,
} from "./renderUtils";
import Operation from "../Operation";
import Property, { Layer } from "../property/Property";

import ControlType, { CROP_TYPE } from "../RenderComponents/ControlType";
import SpecificationModal from "../RenderComponents/SpecificationModal";
import Context, { IContext } from "../context";
import { artSizeList } from "../constants/unit";
import { Divider, Spin } from "antd";
import { base64Encode } from "../utils/imgUtil";

export interface LayerRenderProps {
  data: any;
  mountCallback?: (that?: any) => void;
  onMouseDown?: (current?: Layer) => void;
  /**
   *  canvas渲染区域的宽度，必须给
   */
  canvasWidth: number;
  /**
   * 点击选择图层或者划热区选择区域后的回调
   * @param data
   */
  onChange: (data: any) => void;
  /**
   * 底部左右上一个下一页控件
   */
  navigatorSpace?: React.ReactNode;
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
  platform: string;
  ratio: number;
  colorType: string;
  specificationModalVisible: boolean;
  cropElementVisible: boolean;
  cropType: CROP_TYPE;
  cropStartX: number;
  cropStartY: number;
  cropMoving: boolean;
  progress: number;
}

export interface Specification {
  platform: string;
  colorType: string;
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
  currentLayerPoint: any;
  cropWrap: any;
  cropElement: any;
  cropTop: any;
  cropRight: any;
  cropBottom: any;
  cropLeft: any;

  static defaultProps = {
    canvasWidth: window.innerWidth,
  };

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
    this.currentLayerPoint = {
      x: 0,
      y: 0,
    };
    const [platform, ratio] = props.data.device.split(" @");
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
      platform: platform,
      ratio: parseInt(ratio),
      colorType: "hex",
      specificationModalVisible: false,
      cropElementVisible: false,
      cropType: CROP_TYPE.CLICK,
      cropStartX: 0,
      cropStartY: 0,
      cropMoving: false,
      progress: 0,
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

  loadImg = () => {
    const that = this;
    const request = new XMLHttpRequest();
    request.onloadstart = showProgressBar;
    request.onprogress = updateProgressBar;
    request.onload = showImage;
    request.onloadend = hideProgressBar;
    request.open(
      "GET",
      `https://storage.360buyimg.com/relay/${this.props.data.image}`,
      true
    );
    request.overrideMimeType("text/plain; charset=x-user-defined");
    request.send(null);
    function showProgressBar() {
      that.setState({
        progress: 0,
      });
    }
    function updateProgressBar(e: ProgressEvent) {
      if (e.lengthComputable) {
        that.setState({
          progress: Math.round((e.loaded / e.total) * 100),
        });
      }
    }
    function showImage() {
      const imageElement =
        "data:image/jpeg;base64," + base64Encode(request.responseText);
      that.imageRef.current.style.backgroundImage =
        'url("' + imageElement + '")';
    }

    function hideProgressBar() {
      that.setState({
        progress: 100,
      });
    }
  };

  async componentDidMount() {
    this.loadImg();
    //this.buildCanvas();
    window.addEventListener("resize", this.onResize);
    //document.addEventListener("click", this.onWhiteSpaceClick);
    this.props.mountCallback?.(this);
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
      this.loadImg();
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    //document.removeEventListener("click", this.onWhiteSpaceClick);
  }

  onResize = () => {};

  getPosition = (): { x: number; y: number } => {
    const { scale, data, x, y } = this.state;
    const canvasWidth = this.props.canvasWidth;
    //const canvasHeight = window.innerHeight;
    // @ts-ignore
    const imgWidth = data.width;
    //const imgHeight = data.height * data.artboard_scale;
    return {
      x: (canvasWidth - imgWidth * scale) / 2 - x,
      y: 0 - y,
    };
  };

  getCanvasPoint = (x: number, y: number) => {
    const canvasOffset = this.imageRef.current.getBoundingClientRect();
    return {
      x: x - canvasOffset.left,
      y: y - canvasOffset.top,
    };
  };

  computedScaleUnit = (value: number) => {
    const { scale } = this.state;
    return value * scale;
  };

  onMouseMove = (e: MouseEvent) => {
    const { data, cropType, cropMoving, cropStartX, cropStartY, scale } =
      this.state;
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    if (cropType === CROP_TYPE.CROP) {
      if (cropMoving) {
        if (point.x >= cropStartX) {
          this.cropElement.style.left = cropStartX + "px";
          this.cropTop.style.width = point.x + "px";
          //
          this.cropRight.style.width =
            Math.abs(data.width * scale - point.x) + "px";
          //
          this.cropBottom.style.width =
            Math.abs(data.width * scale - cropStartX) + "px";
          //
          this.cropLeft.style.width = Math.abs(cropStartX) + "px";
        } else {
          this.cropElement.style.left = point.x + "px";
          this.cropTop.style.width = cropStartX + "px";
          //
          this.cropRight.style.width =
            Math.abs(data.width * scale - cropStartX) + "px";
          //
          this.cropBottom.style.width =
            Math.abs(data.width * scale - point.x) + "px";
          //
          this.cropLeft.style.width = Math.abs(point.x) + "px";
        }
        if (point.y >= cropStartY) {
          this.cropElement.style.top = cropStartY + "px";
          this.cropTop.style.height = cropStartY + "px";
          this.cropRight.style.height = point.y + "px";
          this.cropBottom.style.height = data.height * scale - point.y + "px";
          this.cropLeft.style.height = data.height * scale - cropStartY + "px";
        } else {
          this.cropElement.style.top = point.y + "px";
          this.cropTop.style.height = point.y + "px";
          this.cropRight.style.height = cropStartY + "px";
          this.cropBottom.style.height =
            data.height * scale - cropStartY + "px";
          this.cropLeft.style.height = data.height * scale - point.y + "px";
        }
        this.cropElement.style.width = Math.abs(point.x - cropStartX) + "px";
        this.cropElement.style.height = Math.abs(point.y - cropStartY) + "px";
      }
      return;
    }
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
      // this.setState({
      //   x:
      //     x > 0
      //       ? Math.min(data.width * this.state.scale - WHEEL_HOLD, x)
      //       : Math.max(-(data.width * this.state.scale - WHEEL_HOLD), x),
      //   y:
      //     y > 0
      //       ? Math.min(data.height * this.state.scale - WHEEL_HOLD, y)
      //       : Math.max(-(window.innerHeight - WHEEL_HOLD), y),
      // });
      this.setState({
        x,
        y,
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

  onMouseUp = (e: MouseEvent) => {
    this.moving = false;
    const { cropStartX, cropStartY, cropType, scale } = this.state;
    if (cropType === CROP_TYPE.CROP) {
      const { x, y } = this.getPosition();
      //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
      const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
      const position = {
        x: Math.round(Math.min(point.x, cropStartX) / scale),
        y: Math.round(Math.min(cropStartY, point.y) / scale),
        width: Math.round(Math.abs(point.x - cropStartX) / scale),
        height: Math.round(Math.abs(point.y - cropStartY) / scale),
      };

      this.setState({
        cropMoving: false,
        cropElementVisible: false,
      });
      const data = {
        url: `https://storage.360buyimg.com/relay/${this.props.data.image}`,
        relayPageId: this.props.data.id,
        current: {
          frame: position,
        },
      };
      this.props.onChange?.(data);
    }
  };

  onMouseDown = async (e: MouseEvent) => {
    this.moving = true;
    this.tempX = e.clientX;
    this.tempY = e.clientY;
    this.offsetX = this.offsetY = 0;

    e.stopPropagation();
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    if (this.state.cropType === CROP_TYPE.CROP) {
      this.setState({
        cropMoving: true,
        cropElementVisible: true,
        cropStartX: point.x,
        cropStartY: point.y,
      });
      return;
    }
    const { current: currentLayer } = this.state;

    const layers = getLayersByPosition(
      this.validLayers(),
      point,
      true
    ) as any[];
    let index = 0;
    const a =
      this.currentLayerPoint.x != this.tempX ||
      this.currentLayerPoint.y != this.tempY;
    null == currentLayer ||
      a ||
      (index = layers.findIndex((t) => t.id === currentLayer.id) + 1);
    if (index >= layers.length) {
      index = 0;
    }
    index = Math.min(index, layers.length - 1);
    const current = layers[index];
    this.setState({
      current,
    });
    //this.props.onMouseDown?.(current);
    const data = {
      url: `https://storage.360buyimg.com/relay/${this.props.data.image}`,
      relayPageId: this.props.data.id,
      current,
    };
    this.props.onChange?.(data);
    this.currentLayerPoint.x = this.tempX;
    this.currentLayerPoint.y = this.tempY;
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
    //const { data } = this.state;

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
      // this.setState({
      //   x:
      //     x > 0
      //       ? Math.min(data.width * this.state.scale - WHEEL_HOLD, x)
      //       : Math.max(-(data.width * this.state.scale - WHEEL_HOLD), x),
      //   y:
      //     y > 0
      //       ? Math.min(data.height * this.state.scale - WHEEL_HOLD, y)
      //       : Math.max(-(window.innerHeight - WHEEL_HOLD), y),
      // });
      this.setState({
        x,
        y,
      });
    }
  };

  onSpecificationModalVisibleChange = () => {
    this.setState({
      specificationModalVisible: !this.state.specificationModalVisible,
    });
  };

  onChangeSpecification = (value: Specification) => {
    this.setState(value);
    this.onSpecificationModalVisibleChange();
  };

  onChangeColorType = (colorType: string) => {
    this.setState({
      colorType,
    });
  };

  onChangeCropType = (cropType: CROP_TYPE) => {
    this.setState({
      cropType,
    });
  };

  render() {
    const {
      current,
      hoverLayer,
      scale,
      data,
      specificationModalVisible,
      platform,
      ratio,
      colorType,
      cropElementVisible,
      cropType,
      cropStartX,
      cropStartY,
    } = this.state;
    const { navigatorSpace } = this.props;
    // console.log("current", current);
    const { x, y } = this.getPosition();
    const top = this.toRatioPX(this.showMarginTopStyle());
    const bottom = this.toRatioPX(this.showMarginBottomStyle());
    const left = this.toRatioPX(this.showMarginLeftStyle());
    const right = this.toRatioPX(this.showMarginRightStyle());
    const showDistance = !(left && right && top && bottom);
    //const data = JSON.parse(pageInfo.data.data)
    const style = {
      border: 0,
      //backgroundImage: `url('https://storage.360buyimg.com/relay/${this.props.data.image}')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${x}px ${y}px`,
      backgroundSize: `${scale * data.width}px ${scale * data.height}px`,
    };

    const currentStyle: React.CSSProperties = current
      ? {
          width: toUnit(current.frame.width, "px", scale),
          height: toUnit(current.frame.height, "px", scale),
          left: toUnit(current.frame.x - 1, "px", scale),
          top: toUnit(current.frame.y - 1, "px", scale),
          position: "absolute",
          zIndex: 1,
          border: "1px solid #f53914",
        }
      : {};
    const artSize = artSizeList.find((i) => i.platform === platform);
    const contextValue: IContext = {
      colorType,
      onChangeColorType: this.onChangeColorType,
      artSize,
    };
    return (
      <Context.Provider value={contextValue}>
        <div className="layer-render-container">
          <div
            className="layer-render-wrap"
            // @ts-ignore
            onWheel={this.onWheel}
          >
            <canvas
              className="canvas"
              ref={this.imageRef}
              style={style}
              onClick={this.onWhiteSpaceClick}
            >
              123
            </canvas>
            {this.state.progress < 100 && (
              <Spin
                className="load-progress"
                tip={`${this.state.progress} %`}
              />
            )}
            {cropType === CROP_TYPE.CROP ? (
              <div
                className="vft-crop"
                // @ts-ignore
                onMouseUp={this.onMouseUp}
                // @ts-ignore
                onMouseMove={this.onMouseMove}
                // @ts-ignore
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.onMouseleave}
                ref={(node) => (this.cropWrap = node)}
                style={{
                  ...{
                    left: x,
                    top: y,
                    width: data.width * scale,
                    height: data.height * scale,
                  },
                  ...(cropElementVisible
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                      }
                    : {}),
                }}
              >
                {cropElementVisible && (
                  <>
                    <div
                      className="vft-crop-mask vft-crop-top"
                      ref={(node) => (this.cropTop = node)}
                    />
                    <div
                      className="vft-crop-mask vft-crop-right"
                      ref={(node) => (this.cropRight = node)}
                    />
                    <div
                      className="vft-crop-mask vft-crop-bottom"
                      ref={(node) => (this.cropBottom = node)}
                    />
                    <div
                      className="vft-crop-mask vft-crop-left"
                      ref={(node) => (this.cropLeft = node)}
                    />
                    <div
                      className="vft-crop-rectangle"
                      style={{
                        left: cropStartX,
                        top: cropStartY,
                        width: 0,
                        height: 0,
                      }}
                      ref={(node) => (this.cropElement = node)}
                    />
                  </>
                )}
              </div>
            ) : (
              <div
                className="wrap"
                // @ts-ignore
                onMouseMove={this.onMouseMove}
                // @ts-ignore
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.onMouseleave}
                // @ts-ignore
                onMouseUp={this.onMouseUp}
                style={{
                  left: x,
                  top: y,
                  width: data.width * scale,
                  height: data.height * scale,
                }}
              >
                {(current && !hoverLayer) ||
                (current && isEqual(hoverLayer, current)) ? (
                  <div
                    className="border"
                    style={currentStyle}
                    data-width={
                      current ? toUnitNB(current.frame.width, artSize!) : ""
                    }
                    data-height={
                      current ? toUnitNB(current.frame.height, artSize!) : ""
                    }
                  >
                    <div className="corner l" />
                    <div className="corner l2" />
                  </div>
                ) : (
                  current && (
                    <div className="current-item" style={currentStyle}>
                      <div className="corner l" />
                      <div className="corner l2" />
                    </div>
                  )
                )}

                {hoverLayer && !isEqual(hoverLayer, current) && (
                  <div
                    className="hover-item"
                    style={this.toRatioPX({
                      left: hoverLayer.frame.x - 1,
                      top: hoverLayer.frame.y - 1,
                      width: hoverLayer.frame.width,
                      height: hoverLayer.frame.height,
                    })}
                  >
                    <div className="corner l" />
                    <div className="corner l2" />
                  </div>
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
                              data-value={toUnitNB(top.value, artSize!, false)}
                            />
                          )}
                        </div>
                      )}
                      {right && (
                        <div className="right" style={right}>
                          {right.value && (
                            <div
                              className="info"
                              data-value={toUnitNB(
                                right.value,
                                artSize!,
                                false
                              )}
                            />
                          )}
                        </div>
                      )}

                      {bottom && (
                        <div className="bottom" style={bottom}>
                          {bottom.value && (
                            <div
                              className="info"
                              data-value={toUnitNB(
                                bottom.value,
                                artSize!,
                                false
                              )}
                            />
                          )}
                        </div>
                      )}
                      {left && (
                        <div className="left" style={left}>
                          {left.value && (
                            <div
                              className="info"
                              data-value={toUnitNB(left.value, artSize!, false)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="bottom-ctrl-space">
            {navigatorSpace && (
              <>
                {navigatorSpace} <Divider type="vertical" />
              </>
            )}
            <ControlType
              cropType={cropType}
              onChangeCropType={this.onChangeCropType}
            />
            <Divider type="vertical" />
            <Operation
              scale={scale}
              zoomIn={this.zoomIn}
              zoomOut={this.zoomOut}
              zoomToPrimitive={this.zoomToPrimitive}
            />
          </div>

          {current && (
            <Property
              current={current}
              width={data.width}
              height={data.height}
              platform={platform}
              ratio={ratio}
              onModalVisibleChange={this.onSpecificationModalVisibleChange}
            />
          )}
          <SpecificationModal
            platform={platform}
            colorType={colorType}
            visible={specificationModalVisible}
            onChangeSpecification={this.onChangeSpecification}
            onVisibleChange={this.onSpecificationModalVisibleChange}
          />
        </div>
      </Context.Provider>
    );
  }
}

// @ts-ignore
export default LayerRender;
