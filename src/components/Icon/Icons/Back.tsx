import React from "react";
import { Path, Svg } from "react-native-svg";

export const Back = ({ width = 48, height = 48, fill = "white" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z"
        fill={fill}
      />
    </Svg>
  );
};
