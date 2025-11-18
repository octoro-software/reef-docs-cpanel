import React from "react";
import { View, StyleSheet } from "react-native";

type VideoProgressProps = {
  seekTotalTime: number;
  currentTime: number;
};

export const VideoProgress: React.FC<VideoProgressProps> = ({
  seekTotalTime,
  currentTime,
}) => {
  const progress = seekTotalTime > 0 ? currentTime / seekTotalTime : 0;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <View style={[styles.filledBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backgroundBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#ccc", // light gray
    borderRadius: 2,
    overflow: "hidden",
  },
  filledBar: {
    height: "100%",
    backgroundColor: "#007bff", // blue
  },
});
