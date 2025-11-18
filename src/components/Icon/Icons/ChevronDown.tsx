import React from "react";
import { Path, Svg } from "react-native-svg";

export const ChevronDown = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </Svg>
  );
};
