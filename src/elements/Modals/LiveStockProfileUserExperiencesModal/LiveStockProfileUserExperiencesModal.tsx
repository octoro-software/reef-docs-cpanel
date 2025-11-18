import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { getAppDimensions } from "../../../utility/dimensions";

import { LiveStockUserExperiences } from "./Parts/LiveStockUserExperiences";
import { LiveStockUserExperiencePost } from "./Parts/LiveStockUserExperiencePost";
import { FormProvider, useForm } from "react-hook-form";
import { LiveStockUserExperiencePostSuccess } from "./Parts/LiveStockUserExperiencePostSuccess";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePostLiveStockExperience } from "../../../hooks/useLiveStock";
import { sendEventOnce } from "../../../utility/analytics";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockProfileUserExperiencesModal = ({ liveStockId, icon }) => {
  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        content: yup.string().min(10).required("The content is required"),
        liveStockId: yup.string(),
      })
    ),
    defaultValues: {
      liveStockId,
    },
  });

  sendEventOnce("LIVESTOCK_USER_EXPERIENCES_MODAL_OPEN", {
    liveStockId,
  });

  const [handlePostExperience, loading, error, success] =
    usePostLiveStockExperience();

  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleSubmit = async () => {
    const data = methods.getValues();

    await handlePostExperience(data);

    if (!error) {
      handleNextStep(1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={[styles.stepContainer]}>
          <LiveStockUserExperiences
            handleNextStep={handleNextStep}
            icon={icon}
            liveStockId={liveStockId}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockUserExperiencePost
            handleNextStep={handleNextStep}
            handleSubmit={handleSubmit}
            error={error}
            icon={icon}
            loading={loading}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockUserExperiencePostSuccess icon={icon} />
        </View>
      </Animated.View>
    </FormProvider>
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
