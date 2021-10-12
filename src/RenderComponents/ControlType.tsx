import { Radio, Tooltip } from "antd";
import * as React from "react";
import "./ControlType.scss";
interface ControlTypeProps {
  xx?: string;
}

const ControlType: React.FC<ControlTypeProps> = () => {
  return (
    <div className="control-type">
      设计稿截取方式
      <Radio.Group value={0}>
        <Radio value={0}>选图层</Radio>
        <Tooltip title="敬请期待" placement="top">
          <Radio value={1} disabled>
            划热区
          </Radio>
        </Tooltip>
      </Radio.Group>
    </div>
  );
};

export default ControlType;
