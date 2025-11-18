import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getAppDimensions } from "../../../utility/dimensions";

import { PhoneVerificationForm } from "../../../forms/PhoneVerificationForm/PhoneVerificationForm";
import { PhoneVerificationConfirmationForm } from "../../../forms/PhoneVerificationForm/PhoneVerificationConfirmationForm";
import { PhoneVerificationCompleteForm } from "../../../forms/PhoneVerificationForm/PhoneVerificationCompleteForm";

const SCREEN_WIDTH = getAppDimensions().width;

export const PhoneVerificationModal = ({}) => {
  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={styles.stepContainer}>
          <PhoneVerificationForm handleNextStep={handleNextStep} />
        </View>
        <View style={styles.stepContainer}>
          <PhoneVerificationConfirmationForm handleNextStep={handleNextStep} />
        </View>
        <View style={styles.stepContainer}>
          <PhoneVerificationCompleteForm />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: SCREEN_WIDTH,
    padding: 16,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 3, // Total width for 4 steps
    height: "100%",
  },
});
