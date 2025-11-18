import React from "react";
import { Path, Svg } from "react-native-svg";

export const Tank = ({ width = 48, height = 48, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 0 48 48" width={width} fill={fill}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 9.25H10.374H37.376H38.25L38.775 9.94901C41.114 13.062 42.5 16.934 42.5 21.125C42.5 31.411 34.161 39.75 23.875 39.75C13.589 39.75 5.25 31.411 5.25 21.125C5.25 16.934 6.63601 13.062 8.97501 9.94901L9.5 9.25ZM11.2781 12.75C9.6803 15.1477 8.75 18.0254 8.75 21.125C8.75 29.478 15.522 36.25 23.875 36.25C32.228 36.25 39 29.478 39 21.125C39 18.0254 38.0697 15.1477 36.4719 12.75H11.2781ZM25.75 20V16.5H22.25V20H25.75ZM22.25 22V30.5H25.75V22H22.25Z"
        fill={fill}
      />
    </Svg>
  );
};
