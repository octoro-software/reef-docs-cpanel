import React from "react";
import { Path, Svg } from "react-native-svg";

export const ChevronLeft = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </Svg>
  );
};
