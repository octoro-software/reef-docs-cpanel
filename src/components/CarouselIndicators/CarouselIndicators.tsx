import React from "react";
import { View } from "react-native";

import { Grid } from "../Grid/Grid";

import { REEF_DOCS_BLUE } from "../../constants";

type Props = {
  total: number;
  activeIndex: number;
};

export const CarouselIndicators: React.FC<Props> = ({ total, activeIndex }) => {
  return (
    <Grid direction="row" gap={16} justifyContent="center">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === activeIndex ? REEF_DOCS_BLUE : "#ccc",
          }}
        />
      ))}
    </Grid>
  );
};
