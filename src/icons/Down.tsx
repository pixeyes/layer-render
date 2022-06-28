import * as React from "react";

interface DownProps {}

const Down: React.FC<DownProps> = ({}) => {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,
      }}
    >
      <svg
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.7708 0.736568C12.0764 1.05199 12.0764 1.56339 11.7708 1.87882L6.55339 7.26343C6.24776 7.57886 5.75224 7.57886 5.44661 7.26343L0.229221 1.87882C-0.076407 1.56339 -0.076407 1.05199 0.229221 0.736568C0.534848 0.421144 1.03037 0.421144 1.336 0.736568L6 5.55006L10.664 0.736568C10.9696 0.421145 11.4652 0.421145 11.7708 0.736568Z"
          fill="#252525"
        />
      </svg>
    </div>
  );
};

export default Down;
