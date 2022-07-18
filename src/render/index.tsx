import * as React from "react";
import { isEqual } from "lodash-es";
import {
  getLayersByPosition,
  MAX_SCALE,
  MIN_SCALE,
  toUnitNB,
  WHEEL_SCALE_STEP,
} from "../utils";
import {
  computeShowMarginBottomStyle,
  computeShowMarginLeftStyle,
  computeShowMarginRightStyle,
  computeShowMarginTopStyle,
  toUnit,
} from "./renderUtils";
import Property, { Layer } from "../property/Property";

import SpecificationModal from "../RenderComponents/SpecificationModal";
import Context, { IContext } from "../context";
import { artSizeList } from "../constants/unit";
import { Spin } from "antd";
import { base64Encode } from "../utils/imgUtil";
import { DEFAULT_TOP } from "../constants";
import classNames from "classnames";

export interface LayerRenderProps {
  data: any;
  mountCallback?: (that?: any) => void;
  onMouseDown?: (current?: Layer) => void;
  /**
   * 点击选择图层或者划热区选择区域后的回调
   * @param data
   */
  onChange: (data: any) => void;
  scale: number;
  setScale: (scale: number) => void;
  preventWheelContainer?: any;
}

interface State {
  current: Layer & any;
  hoverLayer: any;
  top: any;
  right: any;
  bottom: any;
  left: any;
  x: number;
  y: number;
  data: any;
  platform: string;
  ratio: number;
  colorType: string;
  specificationModalVisible: boolean;
  cropMoving: boolean;
  cropStartX: number;
  cropStartY: number;
  progress: number;
  canvasWidth: number;
  spaceDown: boolean;
  mouseDown: boolean;
}

export interface Specification {
  platform: string;
  colorType: string;
}

class LayerRender extends React.Component<LayerRenderProps, State> {
  containerRef: any;
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

  constructor(props: LayerRenderProps) {
    super(props);
    this.imageRef = React.createRef();
    this.distanceRef = React.createRef();
    this.marginRef = React.createRef();
    this.containerRef = React.createRef();

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
      x: 0,
      y: DEFAULT_TOP,
      data: props.data,
      platform: platform,
      ratio: parseInt(ratio),
      colorType: "hex",
      specificationModalVisible: false,
      cropMoving: false,
      cropStartX: 0,
      cropStartY: 0,
      progress: 0,
      canvasWidth: 0,
      spaceDown: false,
      mouseDown: false,
    };
    //this.layers = props.data.data.info;
  }
  // @ts-ignore
  validLayers = () => {
    const t = this.props.data.data.info;
    const { scale } = this.props;
    t.forEach(function (t: any) {
      t.frame.rx = t.frame.x + t.frame.width;
      t.frame.ry = t.frame.y + t.frame.height;
      const i = scale * t.frame.x,
        n = scale * t.frame.y,
        a = scale * t.frame.width,
        s = scale * t.frame.height,
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
    this.setState({
      canvasWidth: this.containerRef.current.offsetWidth,
    });
    this.adjustScale();
    this.loadImg();
    //this.buildCanvas();
    let preventWheelContainer = this.containerRef.current;
    if (this.props.preventWheelContainer) {
      preventWheelContainer = this.props.preventWheelContainer;
    }
    // @ts-ignore
    preventWheelContainer!.addEventListener(
      "wheel",
      function (event: any) {
        event.preventDefault();
      },
      { passive: false }
    );
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    //document.addEventListener("click", this.onWhiteSpaceClick);
    this.props.mountCallback?.(this);
    const that = this;
    // console.log("emitEvent getContentCurrentLayer");
    const resizeObserver = new ResizeObserver(() => {
      //const entry = entries[0];
      //const cr = entry.contentRect;
      // this.props.setScale(
      //   Math.min(
      //     (this.containerRef.current.offsetWidth - 520) / this.state.data.width,
      //     that.containerRef.current.offsetWidth / that.state.data.width
      //   )
      // );
      this.setState({
        x: (that.state.canvasWidth - that.containerRef.current.offsetWidth) / 2,
      });
    });
    resizeObserver.observe(this.containerRef.current);
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
        x: 0,
        y: DEFAULT_TOP,
        data: this.props.data,
      });
      this.loadImg();
      this.forceUpdate();
      this.adjustScale();
    }
  }

  adjustScale = () => {
    this.props.setScale(
      Math.min(
        1,
        (this.containerRef.current.offsetWidth - 520) / this.state.data.width
      )
    );
  };

  componentWillUnmount() {
    //document.removeEventListener("click", this.onWhiteSpaceClick);
  }

  onResize = () => {};
  onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    console.log(e);
    if (e.code === "Space") {
      this.setState({
        spaceDown: true,
      });
    }
    if (e.metaKey || e.ctrlKey) {
      if (e.code === "Equal") {
        this.setScale(this.props.scale + WHEEL_SCALE_STEP);
      }
      if (e.code === "Minus") {
        this.setScale(this.props.scale - WHEEL_SCALE_STEP);
      }
      if (e.code === "Digit1") {
        this.setScale(1);
      }
    }
  };
  onKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      this.setState({
        spaceDown: false,
      });
    }
  };

  getPosition = (): { x: number; y: number } => {
    const { data, x, y, canvasWidth } = this.state;
    const { scale } = this.props;
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
    const { scale } = this.props;
    return value * scale;
  };

  onMouseleave = () => {
    this.setState({
      hoverLayer: null,
    });
  };

  onMouseDown = async (e: MouseEvent) => {
    this.tempX = e.clientX;
    this.tempY = e.clientY;
    this.offsetX = this.offsetY = 0;

    e.stopPropagation();
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    if (!this.state.spaceDown) {
      this.setState({
        mouseDown: true,
        cropStartX: point.x,
        cropStartY: point.y,
      });
      //   return;
    } else {
      this.setState({
        mouseDown: true,
      });
    }
  };

  onMouseMove = (e: MouseEvent) => {
    const { cropStartX, cropStartY, spaceDown, cropMoving, mouseDown } =
      this.state;
    if (mouseDown) {
      this.moving = true;
    }
    const { x, y } = this.getPosition();
    //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
    const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);
    if (!spaceDown) {
      if (!cropMoving && mouseDown) {
        this.setState({
          cropMoving: true,
        });
      }
      if (mouseDown) {
        if (point.x >= cropStartX) {
          this.cropElement.style.left = cropStartX + "px";
        } else {
          this.cropElement.style.left = point.x + "px";
        }
        if (point.y >= cropStartY) {
          this.cropElement.style.top = cropStartY + "px";
        } else {
          this.cropElement.style.top = point.y + "px";
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

  onMouseUp = (e: MouseEvent) => {
    this.moving = false;
    const { scale } = this.props;
    const { cropStartX, cropStartY, spaceDown } = this.state;
    this.setState({
      cropMoving: false,
      mouseDown: false,
    });
    if (!spaceDown) {
      const { x, y } = this.getPosition();
      //this.context.clearRect(0, 0, pageInfo.data.width * 4, pageInfo.data.height * 4);
      const point = this.getCanvasPoint(e.pageX - x, e.pageY - y);

      // 如果是只点了下鼠标，不移动，则不做任何操作
      if (point.x - cropStartX == 0 || point.y - cropStartY == 0) {
        console.log("here");
        const { current: currentLayer } = this.state;

        const layers = getLayersByPosition(
          this.validLayers(),
          point,
          true
        ) as any[];
        if (layers.length === 0) {
          return;
        }
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
      } else {
        const position = {
          x: Math.round(Math.min(point.x, cropStartX) / scale),
          y: Math.round(Math.min(cropStartY, point.y) / scale),
          width: Math.round(Math.abs(point.x - cropStartX) / scale),
          height: Math.round(Math.abs(point.y - cropStartY) / scale),
        };
        const data = {
          url: `https://storage.360buyimg.com/relay/${this.props.data.image}`,
          relayPageId: this.props.data.id,
          current: {
            frame: position,
          },
        };
        this.props.onChange?.(data);
      }
    }
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
    return value ? toUnit(value, "", this.props.scale) : null;
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
    this.props.setScale(toScale);
  };

  onWheel = (e: WheelEvent) => {
    //const { data } = this.state;

    if (e.ctrlKey || e.metaKey) {
      this.setScale(
        this.props.scale +
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

  render() {
    const {
      current,
      hoverLayer,
      data,
      specificationModalVisible,
      platform,
      ratio,
      colorType,
      cropMoving,
      mouseDown,
      cropStartX,
      cropStartY,
      spaceDown,
    } = this.state;
    const { scale } = this.props;
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
        <div className="layer-render-container" ref={this.containerRef}>
          <div
            className={classNames("layer-render-wrap", {
              crop: !spaceDown && cropMoving,
              grab: spaceDown,
              grabbing: spaceDown && mouseDown,
            })}
            // @ts-ignore
            onWheel={this.onWheel}
            // @ts-ignore
            onMouseUp={this.onMouseUp}
            // @ts-ignore
            onMouseMove={this.onMouseMove}
            // @ts-ignore
            onMouseDown={this.onMouseDown}
            onMouseLeave={this.onMouseleave}
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
            <div
              className="vft-crop"
              // @ts-ignore
              ref={(node) => (this.cropWrap = node)}
              style={{
                ...{
                  left: x,
                  top: y,
                  width: data.width * scale,
                  height: data.height * scale,
                },
                ...(cropMoving
                  ? {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }
                  : {}),
              }}
            >
              <>
                <div
                  className="vft-crop-rectangle"
                  style={{
                    left: cropStartX,
                    top: cropStartY,
                    width: 0,
                    height: 0,
                    display: cropMoving ? "block" : "none",
                  }}
                  ref={(node) => (this.cropElement = node)}
                />
              </>
            </div>
            <div
              className="wrap"
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
                            data-value={toUnitNB(right.value, artSize!, false)}
                          />
                        )}
                      </div>
                    )}

                    {bottom && (
                      <div className="bottom" style={bottom}>
                        {bottom.value && (
                          <div
                            className="info"
                            data-value={toUnitNB(bottom.value, artSize!, false)}
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
