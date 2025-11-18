import React from "react";
import { View } from "react-native";
import { getAppDimensions } from "../utility/dimensions";
import { REEF_DOCS_BLUE, WHITE } from "../constants";

export const VideoCarouselPips = ({ total, activeIndex, maxVisible = 5 }) => {
  // Calculate start index for infinite scroll effect
  let start = 0;
  if (total > maxVisible) {
    if (activeIndex <= Math.floor(maxVisible / 2)) {
      start = 0;
    } else if (activeIndex >= total - Math.ceil(maxVisible / 2)) {
      start = total - maxVisible;
    } else {
      start = activeIndex - Math.floor(maxVisible / 2);
    }
  }
  const pips = Array.from({ length: Math.min(total, maxVisible) }, (_, i) => {
    const pipIndex = start + i;
    const isActive = pipIndex === activeIndex;
    return (
      <View
        key={pipIndex}
        style={{
          width: isActive ? 32 : 32,
          height: 4,
          borderRadius: 2,
          backgroundColor: isActive ? REEF_DOCS_BLUE : WHITE,
          marginHorizontal: 2,
          opacity: isActive ? 1 : 0.7,
          transition: "width 0.2s",
        }}
      />
    );
  });
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 99999999,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 12,

          width: getAppDimensions().width,
        }}
      >
        {pips}
      </View>
    </View>
  );
};
