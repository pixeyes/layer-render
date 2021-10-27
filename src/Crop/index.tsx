import * as React from "react";
import classNames from "classnames";

export interface CropProps {
  onEscHandle: any;
  bgImg?: string;
  style?: React.CSSProperties;
  positionX: number;
  positionY: number;
}

class Crop extends React.Component<CropProps> {
  wrap: any;
  top: any;
  right: any;
  bottom: any;
  left: any;
  element: any;
  state = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    element: false,
    moving: false,
  };

  componentDidMount() {
    const classes = document.body.className;
    document.body.className = classNames(classes, "vft-mask-open");
    document.addEventListener("keydown", this.onKeydown);
  }
  componentWillUnmount() {
    const classes = document.body.className.replace(
      /(^| )vft-mask-open( |$)/,
      " "
    );
    document.body.className = classNames(classes).trim();
    document.removeEventListener("keydown", this.onKeydown);
  }

  onKeydown = (event: any) => {
    console.log(event.key);
    if (event.key == "Escape" || event.key == "Esc") {
      this.props.onEscHandle();
    }
  };

  onClick = (event: any) => {
    event.stopPropagation();
    //this.context.onStartCrop();
  };

  getCanvasPoint = (x: number, y: number) => {
    const canvasOffset = this.wrap.getBoundingClientRect();
    return {
      x: x - canvasOffset.left,
      y: y - canvasOffset.top,
    };
  };

  onMouseDown = (event: any) => {
    event.stopPropagation();
    const { element } = this.state;
    if (element) {
    } else {
      this.setState({
        element: true,
        moving: true,
        startX: event.clientX,
        startY: event.clientY,
      });
    }
  };

  onMouseUp = (event: any) => {
    event.stopPropagation();
    const { element, startX, startY } = this.state;
    if (element) {
      this.setState({
        moving: false,
      });
      //log("event", event);
      let position;
      if (event.clientX - startX < 10 || event.clientY - startY < 10) {
        position = {
          x: 0,
          y: 0,
          w: window.innerWidth,
          h: window.innerHeight,
          pw: window.innerWidth,
          pageY: 0,
        };
      } else {
        position = {
          x: startX,
          y: startY,
          w: Math.abs(event.clientX - startX),
          h: Math.abs(event.clientY - startY),
          pw: window.innerWidth,
          pageY: event.pageY - Math.abs(event.clientY - startY),
        };
      }
      console.log(position);
    }
  };
  onMouseMove = (event: any) => {
    event.stopPropagation();
    const { element, moving, startX, startY } = this.state;
    const {positionX,positionY} = this.props
    console.log("positionX:",positionX)
    const point = this.getCanvasPoint(event.pageX - positionX, event.pageY - positionY);
    console.log(point)
    if (element && moving) {
      if (event.clientX >= startX && event.clientY >= startY) {
        this.element.style.width = Math.abs(event.clientX - startX) + "px";
        this.element.style.height = Math.abs(event.clientY - startY) + "px";

        this.top.style.width = event.clientX + "px";
        this.top.style.height = startY + "px";

        this.right.style.width =
          Math.abs(document.documentElement.clientWidth - event.clientX) + "px";
        this.right.style.height = event.clientY + "px";

        this.bottom.style.width =
          Math.abs(document.documentElement.clientWidth - startX) + "px";
        this.bottom.style.height = window.innerHeight - event.clientY + "px";

        this.left.style.width = Math.abs(startX) + "px";
        this.left.style.height = window.innerHeight - startY + "px";
      }
    }
  };
  render() {
    const { element, startX, startY } = this.state;
    const cropStyle = {
      ...this.props.style,
      ...(element
        ? {
            backgroundColor: "rgba(0, 0, 0, 0)",
          }
        : {}),
    };
    return (
      <div
        className="vft-crop"
        onMouseMove={this.onMouseMove}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        ref={(node) => (this.wrap = node)}
        style={cropStyle}
      >
        {element && (
          <>
            <div
              className="vft-crop-mask vft-crop-top"
              ref={(node) => (this.top = node)}
            />
            <div
              className="vft-crop-mask vft-crop-right"
              ref={(node) => (this.right = node)}
            />
            <div
              className="vft-crop-mask vft-crop-bottom"
              ref={(node) => (this.bottom = node)}
            />
            <div
              className="vft-crop-mask vft-crop-left"
              ref={(node) => (this.left = node)}
            />
            <div
              className="vft-crop-rectangle"
              style={{
                left: startX,
                top: startY,
                width: 0,
                height: 0,
              }}
              ref={(node) => (this.element = node)}
            />
          </>
        )}
      </div>
    );
  }
}

export default Crop;
