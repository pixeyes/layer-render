import * as React from "react";

const ZoomIn: React.FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3C10.5043 3 10.913 3.40878 10.913 3.91304V9.08696H16.087C16.5912 9.08696 17 9.49574 17 10C17 10.5043 16.5912 10.913 16.087 10.913H10.913V16.087C10.913 16.5912 10.5043 17 10 17C9.49574 17 9.08696 16.5912 9.08696 16.087V10.913H3.91304C3.40878 10.913 3 10.5043 3 10C3 9.49574 3.40878 9.08696 3.91304 9.08696H9.08696V3.91304C9.08696 3.40878 9.49574 3 10 3Z"
        fill="#252525"
      />
    </svg>
  );
};

export default ZoomIn;
