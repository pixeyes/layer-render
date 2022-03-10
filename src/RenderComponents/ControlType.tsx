import { Radio } from "antd";
import * as React from "react";
export enum CROP_TYPE {
  CLICK = 0,
  CROP = 1,
}
export interface ControlTypeProps {
  cropType: CROP_TYPE;
  onChangeCropType: (cropType: CROP_TYPE) => void;
}

const ControlType: React.FC<ControlTypeProps> = ({
  cropType,
  onChangeCropType,
}) => {
  return (
    <div className="control-type">
      <span className="title">截图方式</span>
      <Radio.Group
        optionType="button"
        options={[
          { label: "选图层", value: CROP_TYPE.CLICK },
          { label: "划热区", value: CROP_TYPE.CROP },
        ]}
        buttonStyle="solid"
        value={cropType}
        onChange={(e) => onChangeCropType(e.target.value)}
      />
    </div>
  );
};

export default ControlType;
