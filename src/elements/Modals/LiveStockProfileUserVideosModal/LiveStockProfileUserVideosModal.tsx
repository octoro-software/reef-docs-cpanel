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

import { LiveStockProfileUserVideos } from "./Parts/LiveStockProfileUserVideos";
import { LiveStockProfileUserSelectVideo } from "./Parts/LiveStockProfileUserSelectVideo";
import { LiveStockProfileUserVideoPostSuccess } from "./Parts/LiveStockProfileUserVideoPostSuccess";
import { sendEventOnce } from "../../../utility/analytics";
import { useSubmitVideoContribution } from "../../../hooks/useLiveStock";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockProfileUserVideosModal = ({
  liveStockId,
  icon,
  height,
}) => {
  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        videos: yup
          .array(
            yup.object({
              uri: yup.string().required(),
              type: yup.string(),
              fileName: yup.string(),
            })
          )
          .min(1, "Please provide atleast one video")
          .required(),
      })
    ),
  });

  sendEventOnce("LIVESTOCK_VIDEO_MODAL_OPEN", {
    liveStockId,
  });

  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const [submitContribution] = useSubmitVideoContribution();

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleSubmit = async () => {
    const data = methods.getValues();

    if (data?.videos?.length > 0) {
      const orientation =
        data.videos[0]?.width >= data.videos[0]?.height
          ? "horizontal"
          : "vertical";

      data["videoOrientation"] = orientation;
    }

    data["liveStockId"] = liveStockId;

    await submitContribution(data, data.videos);

    handleNextStep(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={[styles.stepContainer, { padding: 0 }]}>
          <LiveStockProfileUserVideos
            handleNextStep={handleNextStep}
            liveStockId={liveStockId}
            icon={icon}
            height={height}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockProfileUserSelectVideo
            handleNextStep={handleNextStep}
            icon={icon}
            handleSubmit={handleSubmit}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockProfileUserVideoPostSuccess icon={icon} />
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
