import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

import { BLACK } from "../../constants/colors";

type WeightOptions = "bold" | "regular" | "semiBold";

type HeadingProps = {
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TextStyle;
  children: React.ReactNode;
  weight: WeightOptions;
};

export const Heading: React.FC<HeadingProps> = ({
  variant,
  weight = "regular",
  style,
  children,
}) => {
  const getHeadingStyle = (variant: number): TextStyle => {
    switch (variant) {
      case 1:
        return styles.h1;
      case 2:
        return styles.h2;
      case 3:
        return styles.h3;
      case 4:
        return styles.h4;
      case 5:
        return styles.h5;
      case 6:
        return styles.h6;
      default:
        return styles.h1;
    }
  };

  const getWeightFont = (weight: WeightOptions) => {
    switch (weight) {
      case "bold":
        return styles.bold;
      case "regular":
        return styles.regular;
      case "semiBold":
        return styles.semiBold;
      default:
        return styles.regular;
    }
  };

  return (
    <Text
      style={[
        getHeadingStyle(variant),
        getWeightFont(weight),
        styles.base,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: BLACK,
  },
  bold: {
    fontFamily: "Poppins-Bold",
  },
  regular: {
    fontFamily: "Poppins-Regular",
  },
  semiBold: {
    fontFamily: "Poppins-SemiBold",
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 28,
  },
  h3: {
    fontSize: 24,
  },
  h4: {
    fontSize: 20,
  },
  h5: {
    fontSize: 16,
  },
  h6: {
    fontSize: 12,
  },
});
