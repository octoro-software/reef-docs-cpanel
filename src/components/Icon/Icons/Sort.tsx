import React from "react";
import { Path, Svg } from "react-native-svg";

export const Sort = ({ width = 24, height = 24, fill = "#e8eaed" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"
        fill={fill}
      />
    </Svg>
  );
};
