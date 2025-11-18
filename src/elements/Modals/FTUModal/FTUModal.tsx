import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { getAppDimensions } from "../../../utility/dimensions";
import { Data } from "./Data";
import { FTUDisplay } from "./Parts/FTUDisplay";
import { useAudience } from "../../../hooks/useAudience";

const SCREEN_WIDTH = getAppDimensions().width;

export type FTUModalType = "home";

export const FTUModal = ({ type }) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const data = Data[type];

  const { isFresh } = useAudience();

  return (
    <View>
      <Animated.View
        style={[
          styles.animatedContainer,
          animatedStyle,
          { width: SCREEN_WIDTH * 4 },
        ]}
      >
        <View style={styles.stepContainer}>
          <FTUDisplay cards={data?.cards} isFresh={isFresh} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: SCREEN_WIDTH,
  },
  animatedContainer: {
    flexDirection: "row",
    height: "100%",
  },
});
