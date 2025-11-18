import React from "react";
import { Path, Svg } from "react-native-svg";

export const ChevronRight = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </Svg>
  );
};
