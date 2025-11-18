import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { REGISTER_GRADIENT } from "../../constants";

export const ProgressBar: React.FC<{
  percentage: number; // Percentage value (0 to 100)
  height?: number; // Optional: height of the bar
  gradientColors?: string[]; // Optional: gradient colors
}> = ({ percentage, height = 10, gradientColors = REGISTER_GRADIENT }) => {
  const progressWidth = Math.max(0, Math.min(percentage, 100)); // Clamp percentage between 0 and 100

  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progress, { width: `${progressWidth}%`, height }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    borderRadius: 10,
  },
});
