import * as React from "react";
import { Button, Form, Modal, Select } from "antd";
import { jo } from "../property/constants";
import { Specification } from "../render";
import { artSizeList } from "../constants/unit";
import {useEffect} from "react";

interface SpecificationModalProps {
  visible: boolean;
  onChangeSpecification: (values: any) => void;
  onVisibleChange: () => void;
  platform: string;
  colorType: string;
}

const SpecificationModal: React.FC<SpecificationModalProps> = ({
  visible,
  onChangeSpecification,
  onVisibleChange,
  platform,
  colorType,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values: Specification) => {
    onChangeSpecification(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      platform: platform,
      colorType: colorType,
    });
  }, [platform, colorType]);

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
        initialValues={{ platform: platform, colorType: colorType }}
        onFinish={onFinish}
      >
        <Form.Item name="platform" label="文档设置">
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
              <Select.Option key={color} value={color.toLowerCase()}>
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
