import React from "react";

export const ResetFilledIcon: React.FC<{
  color?: string;
  size?: number;
}> = ({ size = 16, color = "#D1D5DB" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Reset">
        <path
          id="Shape"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.15339 2.31295C5.34865 2.50821 5.34865 2.8248 5.15339 3.02006L3.87361 4.29984H9.59984C12.2324 4.29984 14.3665 6.43395 14.3665 9.0665C14.3665 11.6991 12.2324 13.8332 9.59984 13.8332H5.33317C5.05703 13.8332 4.83317 13.6093 4.83317 13.3332C4.83317 13.057 5.05703 12.8332 5.33317 12.8332H9.59984C11.6801 12.8332 13.3665 11.1468 13.3665 9.0665C13.3665 6.98623 11.6801 5.29984 9.59984 5.29984H3.87361L5.15339 6.57962C5.34865 6.77488 5.34865 7.09146 5.15339 7.28672C4.95813 7.48199 4.64155 7.48199 4.44628 7.28672L2.31295 5.15339C2.11769 4.95813 2.11769 4.64155 2.31295 4.44628L4.44628 2.31295C4.64155 2.11769 4.95813 2.11769 5.15339 2.31295Z"
          fill={color}
        />
      </g>
    </svg>
  );
};
