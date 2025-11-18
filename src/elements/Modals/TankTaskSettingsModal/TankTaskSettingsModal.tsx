import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getAppDimensions } from "../../../utility/dimensions";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSetTaskPreferences } from "../../../hooks/useTankTasks";
import { TankTaskSettingsForm } from "./Parts/TankTaskSettingsForm";
import { TankTaskSettingsFormSuccess } from "./Parts/TankTaskSettingsFormSuccess";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectTankTaskPreferences } from "../../../store/slices/tankSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const TankTaskSettingsModal = ({}) => {
  const [postUserPreferences, loading, error] = useSetTaskPreferences();

  const taskPreferences = useAppSelector(selectTankTaskPreferences);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        pushNotifications: yup.boolean(),
        emailNotifications: yup.boolean(),
        emailMonthlyReport: yup.boolean(),
        timings: yup.array(),
      })
    ),
    defaultValues: {},
  });

  const handleSetTaskPreferences = async () => {
    const data = { ...taskPreferences };

    const formattedTimings = (data.timings || []).map((t) => ({ value: t }));

    methods.reset({
      ...data,
      timings: formattedTimings,
    });
  };

  useEffect(() => {
    handleSetTaskPreferences();
  }, []);

  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleSubmit = async () => {
    const { timings, ...rest } = methods.getValues();

    const finalData = {
      ...rest,
      timings: timings.map((t) => t.value),
    };
    await postUserPreferences(finalData);

    if (!loading && !error) {
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
          <TankTaskSettingsForm
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </View>
        <View style={styles.stepContainer}>
          <TankTaskSettingsFormSuccess />
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
