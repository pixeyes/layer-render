import * as React from "react";
import ZoomIn from "./icons/ZoomIn";
import ZoomOut from "./icons/ZoomOut";
import Primitive from "./icons/Primitive";
import {Divider, Tooltip} from "antd";

export interface OperationProps {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToPrimitive: () => void;
}

function Operation(props: OperationProps) {
  const { zoomIn, zoomOut, zoomToPrimitive } = props;
  return (
    <div className="page-operation-module">
      <Divider type="vertical" />
      <div className="white-board-module zoom-in-out">
        <Tooltip title="放大">
          <button
            className="button-module page-zoom_out_btn rel-btn--icon rel-btn--medium"
            onClick={zoomIn}
          >
            <div className="icon-wrap">
              <ZoomIn />
            </div>
          </button>
        </Tooltip>
        <Tooltip title="缩小">
          <button
            className="button-module page-zoom_in_btn rel-btn--icon rel-btn--medium"
            onClick={zoomOut}
          >
            <div className="icon-wrap">
              <ZoomOut />
            </div>
          </button>
        </Tooltip>
        <Tooltip title="原始">
          <button
            className="button-module page-zoom_in_btn rel-btn--icon rel-btn--medium"
            onClick={zoomToPrimitive}
          >
            <div className="icon-wrap">
              <Primitive />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Operation;
