import React from "react";
import { Path, Svg } from "react-native-svg";

export const Add = ({ width = 48, height = 48, fill = "white" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
        fill={fill}
      />
    </Svg>
  );
};
