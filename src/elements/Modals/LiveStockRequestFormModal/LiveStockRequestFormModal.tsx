import React from "react";
import { StyleSheet, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { getAppDimensions } from "../../../utility/dimensions";

import { LiveStockRequestForm } from "./Parts/LiveStockRequestForm";
import { LiveStockRequestFormPostSuccess } from "./Parts/LiveStockRequestFormPostSuccess";
import { useLiveStockProfileRequest } from "../../../hooks/useLiveStock";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockRequestFormModal = ({ icon, coralRequest }) => {
  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required().max(200),
        reference1: yup.string().max(500),
        reference2: yup.string().max(500),
      })
    ),
  });

  const [
    postLiveStockRequest,
    postLiveStockRequestLoading,
    postLiveStockRequestError,
  ] = useLiveStockProfileRequest();

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

    const valid = await methods.trigger();
    if (!valid) {
      return;
    }

    await postLiveStockRequest(data);

    if (!postLiveStockRequestLoading && !postLiveStockRequestError) {
      handleNextStep(1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={styles.stepContainer}>
          <LiveStockRequestForm
            handleNextStep={handleNextStep}
            handleSubmit={handleSubmit}
            loading={postLiveStockRequestLoading}
            error={postLiveStockRequestError}
            icon={icon}
            coralRequest={coralRequest}
          />
        </View>

        <View style={styles.stepContainer}>
          <LiveStockRequestFormPostSuccess />
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
