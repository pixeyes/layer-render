import { Radio } from "antd";
import * as React from "react";
export enum CROP_TYPE {
  CLICK = 0,
  CROP = 1,
}
interface ControlTypeProps {
  cropType: CROP_TYPE;
  onChangeCropType: (cropType: CROP_TYPE) => void;
}

const ControlType: React.FC<ControlTypeProps> = ({ cropType,onChangeCropType }) => {
  return (
    <div className="control-type">
      设计稿截取方式
      <Radio.Group value={cropType} onChange={e => onChangeCropType(e.target.value)}>
        <Radio value={CROP_TYPE.CLICK}>选图层</Radio>
        <Radio value={CROP_TYPE.CROP}>划热区</Radio>
      </Radio.Group>
    </div>
  );
};

export default ControlType;
