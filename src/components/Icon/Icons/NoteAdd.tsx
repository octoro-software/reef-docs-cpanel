import React from "react";
import { Path, Svg } from "react-native-svg";

export const NoteAdd = ({ width = 24, height = 24, fill = "white" }) => {
  return (
    <Svg height={height} viewBox="0 -960 960 960" width={width} fill={fill}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M440-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
        fill={fill}
      />
    </Svg>
  );
};
