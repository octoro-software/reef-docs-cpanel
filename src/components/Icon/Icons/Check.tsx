import React from "react";
import { Path, Svg } from "react-native-svg";

export const Check = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
    </Svg>
  );
};
