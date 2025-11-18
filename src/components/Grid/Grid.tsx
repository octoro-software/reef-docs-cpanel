import React from "react";
import { View } from "react-native";

type GridProps = {
  children: React.ReactNode;
  style?: any;
  gap?: number;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?: "center" | "flex-end" | "flex-start" | "space-between";
  alignItems?: "center" | "flex-end" | "flex-start" | "space-between";
};

export const Grid: React.FC<GridProps> = ({
  children,
  style,
  gap = 0,
  direction = "column",
  alignItems,
  justifyContent,
}) => {
  return (
    <View
      style={[
        { gap },
        style,
        { flexDirection: direction, justifyContent, alignItems, with: "100%" },
      ]}
    >
      {children}
    </View>
  );
};

type GridItemProps = {
  flex?: number;
};

export const GridItem: React.FC<GridProps & GridItemProps> = ({
  children,
  style,
  gap = 0,
  alignItems,
  justifyContent,
  flex,
}) => {
  return (
    <View style={[{ gap }, style, { flex, justifyContent, alignItems }]}>
      {children}
    </View>
  );
};
