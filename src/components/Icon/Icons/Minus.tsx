import React from "react";
import { Path, Svg } from "react-native-svg";

export const Minus = ({ width = 48, height = 48, fill = "white" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M200-440v-80h560v80H200Z"
        fill={fill}
      />
    </Svg>
  );
};
