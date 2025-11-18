import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../../components";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useUser } from "../../../../hooks/useAuth";
import { REEF_DOCS_BLUE } from "../../../../constants";

export const UserReputationSection = () => {
  const profile = useUser();

  const level = profile?.level;
  const xpRequiredForNextLevel = profile?.xpRequiredNextLevel || 1;
  const xpGainedThisLevel = profile?.xpGainedThisLevel || 0;

  const progress = Math.min(xpGainedThisLevel / xpRequiredForNextLevel, 1);

  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 800 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>
        Level {level} - {xpGainedThisLevel} / {xpRequiredForNextLevel} XP
      </Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    marginVertical: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  progressBarBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: REEF_DOCS_BLUE,
  },
});
