import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useGetTaskTemplates } from "../../../hooks/useTankTasks";
import { useGetActiveTank } from "../../../hooks/useTanks";

import { getAppDimensions } from "../../../utility/dimensions";

import { TankTaskModal } from "../TankTaskModal/TankTaskModal";
import { TankTaskTemplates } from "./Parts/TankTaskTemplates";

const SCREEN_WIDTH = getAppDimensions().width;

export const TankEditTasksModal = ({ task }) => {
  const [taskTemplates, setTaskTemplates] = useState([]);

  const [activeTask, setActiveTask] = useState(null);

  const [getTaskTemplates, getTaskTemplatesLoading] = useGetTaskTemplates();

  const activeTank = useGetActiveTank();

  const tankId = activeTank?.id;

  const handleGetTaskTemplates = async () => {
    const response = await getTaskTemplates(tankId);

    if (response?.data?.data) {
      setTaskTemplates(response?.data?.data);
    }
  };

  useEffect(() => {
    handleGetTaskTemplates();
  }, [tankId]);

  const [step, setStep] = React.useState(0);

  const translateX = useSharedValue(0);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleTaskPress = (task) => {
    setActiveTask(task);
    handleNextStep(1);
  };

  const handleBack = () => handleNextStep(-1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
      <View style={styles.stepContainer}>
        <TankTaskTemplates
          handleTaskPress={handleTaskPress}
          taskTemplates={taskTemplates}
          loading={getTaskTemplatesLoading}
        />
      </View>
      <View style={{ ...styles.stepContainer, padding: 0 }}>
        <TankTaskModal task={activeTask} handleBack={handleBack} />
      </View>
    </Animated.View>
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
