import React from "react";
import { StyleSheet, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { selectStructuredConfigurationById } from "../../../store/slices/structuredConfigurationSlice";

import { useAppSelector } from "../../../hooks/useRedux";
import { useLiveStockVote } from "../../../hooks/useLiveStock";

import { getAppDimensions } from "../../../utility/dimensions";

import { LiveStockVoteSuccess } from "./Parts/LiveStockVoteSuccess";
import { LiveStockVoteForm } from "./Parts/LiveStockVoteForm";

import { selectLiveStockUserPastVotes } from "../../../store/slices/liveStockSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockVoteModal = ({ option, liveStockId }) => {
  const [liveStockVote, loading, error, success] = useLiveStockVote();

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        optionId: yup.string().required("Please choose an option"),
        reasoning: yup.string().required("Please provide a reasoning").max(500),
        liveStockId: yup.string().required(),
      })
    ),
    defaultValues: {
      liveStockId,
    },
  });

  const structuredConfiguration = useAppSelector(
    selectStructuredConfigurationById(option)
  );

  const pastVotes = useAppSelector(selectLiveStockUserPastVotes(liveStockId));

  const hasVoted = !!pastVotes?.find((p) => p.definition === option);

  const range = ["livestock_size", "livestock_tank_limit"].includes(
    structuredConfiguration?.[0]?.definition
  );

  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleSubmit = async () => {
    const data = form.getValues();

    await liveStockVote(data);

    if (!loading && !error) {
      handleNextStep(1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...form}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={styles.stepContainer}>
          <LiveStockVoteForm
            structuredConfiguration={structuredConfiguration}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            hasVoted={hasVoted}
            range={range}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockVoteSuccess />
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
