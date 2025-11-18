import React from "react";
import { StyleSheet, View } from "react-native";
import { getAppDimensions } from "../../utility/dimensions";
import { INPUT_BORDER_COLOR, WHITE } from "../../constants";

const height = getAppDimensions().height;

export const Sidebar: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height,
    position: "absolute",
    backgroundColor: INPUT_BORDER_COLOR,
    padding: 8,
    zIndex: 999,
    borderRightWidth: 1,
    borderRightColor: INPUT_BORDER_COLOR,
  },
});
