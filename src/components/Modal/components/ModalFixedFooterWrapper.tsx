import React from "react";
import { StyleSheet, View } from "react-native";

export const ModalFixedFooterWrapper = ({ children, style }) => {
  return <View style={[styles.root, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1, // ✅ Makes it fill height
  },
});
