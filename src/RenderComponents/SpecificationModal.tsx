import * as React from "react";
import { Button, Form, Modal, Select } from "antd";
import { jo } from "../property/constants";
import {Specification} from "../render";

interface SpecificationModalProps {
  visible: boolean;
  onChangeSpecification: (values: any) => void;
  onVisibleChange: () => void;
}
const artSizeList = [
  {
    platform: "iOS",
    unit: "pt",
    fontUnit: "pt",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/ios_platform_icon.ee53ffd5.svg",
    },
    name: "iOS/pt（上传默认单位）",
    selected: true,
    clstag: "h|keycount|web_page_equipment|2",
  },
  {
    platform: "Android",
    unit: "dp",
    fontUnit: "sp",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/android_platform_icon.80ba33c0.svg",
    },
    name: "Android/dp",
    selected: false,
    clstag: "h|keycount|web_page_equipment|3",
  },
  {
    platform: "Web",
    unit: "px",
    fontUnit: "px",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/pc_platform_icon.ded3b163.svg",
    },
    name: "Web/px",
    selected: false,
    clstag: "h|keycount|web_page_equipment|4",
  },
  {
    platform: "像素",
    unit: "px",
    fontUnit: "px",
    ratio: 1,
    picType: "svg",
    leftTip: {
      type: "icon",
      icon: "//s1-relay.360buyimg.com/relay/release/platform/web/img/other_platform_icon.08f4efc5.svg",
    },
    name: "像素/px",
    selected: false,
    clstag: "h|keycount|web_page_equipment|5",
  },
];

const SpecificationModal: React.FC<SpecificationModalProps> = ({
  visible,
  onChangeSpecification,
  onVisibleChange,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values: Specification) => {
    onChangeSpecification(values);
  };

  return (
    <Modal
      title="设置项目规格"
      visible={visible}
      footer={null}
      width={440}
      className="layer-specification-modal"
      onCancel={onVisibleChange}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        initialValues={{ model: "Android", colorType: "RGBA" }}
        onFinish={onFinish}
      >
        <Form.Item name="model" label="文档设置">
          <Select>
            {artSizeList.map((artSize) => (
              <Select.Option value={artSize.platform} key={artSize.platform}>
                <img className="label-img" src={artSize.leftTip.icon} alt="" />
                {artSize.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="colorType" label="颜色模式设置">
          <Select>
            {jo.map((color) => (
              <Select.Option key={color} value={color}>
                {color}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="default"
            size={"large"}
            style={{ marginRight: 24, width: 102 }}
            onClick={onVisibleChange}
          >
            取消
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size={"large"}
            style={{ width: 102 }}
          >
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SpecificationModal;
