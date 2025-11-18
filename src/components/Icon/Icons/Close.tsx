import React from "react";
import { Path, Svg } from "react-native-svg";

export const Close = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
    </Svg>
  );
};
