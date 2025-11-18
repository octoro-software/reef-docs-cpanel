import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = getAppDimensions();

export const Overlay = ({ handlePress, active }) => {
  const insets = useSafeAreaInsets();

  if (!active) return null;

  return (
    <TouchableOpacity
      style={[styles.root, { bottom: insets.bottom + 60 }]}
      onPress={handlePress}
    >
      <View style={[styles.root, { top: -height - (24 + insets.bottom) }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent overlay
    position: "absolute",
    left: -width / 2 - 16,
    top: -height - 24,
    bottom: 0,
    width: width + 100, // Ensure it covers the full width
    height: height, // Covers the entire screen height
    flex: 1,
  },
});
