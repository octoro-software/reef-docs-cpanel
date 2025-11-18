import React from "react";
import { StyleSheet, View } from "react-native";

import { getAppDimensions } from "../../../utility/dimensions";

import { INPUT_BORDER_COLOR, Z_INDEX } from "../../../constants";

const SCREEN_WIDTH = getAppDimensions().width;

export const FixedFooter = ({
  children,
  handleLayout,
  fix = false,
  style,
  keyboardBottom,
}) => {
  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.footerRoot,
        fix
          ? { left: 0, bottom: keyboardBottom ?? 0 }
          : { bottom: keyboardBottom ?? 28, left: -16 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footerRoot: {
    position: "absolute",
    width: SCREEN_WIDTH,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    zIndex: Z_INDEX.fixedFooterModal,
    padding: 16,
    backgroundColor: "white",
  },
});
