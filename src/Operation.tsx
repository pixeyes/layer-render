import * as React from "react";

import { Dropdown, Menu } from "antd";
import { DownOutlined, CheckOutlined } from "@ant-design/icons";
export interface OperationProps {
  scale: number;
  setScale: (scale: number) => void;
}

const sizes = [0.5, 0.75, 1, 1.25, 1.5];

function Operation(props: OperationProps) {
  const menu = (
    <Menu>
      {sizes.map((size, index) => (
        <Menu.Item key={index} onClick={() => props.setScale(size)}>
          <span>
            {size * 100}%
          </span>
          {size === props.scale && <CheckOutlined />}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div className="page-operation-module">
      <Dropdown overlayClassName="scale-dropdown" overlay={menu} >
        <span className="scale-dropdown-link">
          {Math.round(props.scale * 100)}% <DownOutlined />
        </span>
      </Dropdown>
    </div>
  );
}

export default Operation;
