import React from "react";
import { Path, Svg } from "react-native-svg";

export const Home = ({
  width = 24,
  height = 24,
  fill = "#e8eaed",
  solid = false,
}) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        d={
          solid
            ? "M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"
            : "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
        }
      />
    </Svg>
  );
};
