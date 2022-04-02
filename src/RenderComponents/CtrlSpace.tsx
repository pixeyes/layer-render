import * as React from "react";
import classNames from "classnames";
import "./ctrlSpace.scss";
interface CtrlSpaceProps {
  className?: string;
}

const CtrlSpace: React.FC<CtrlSpaceProps> = ({ children, className }) => {
  return (
    <div className={classNames("pixeye-ctrl-space", className)}>{children}</div>
  );
};

export default CtrlSpace;
