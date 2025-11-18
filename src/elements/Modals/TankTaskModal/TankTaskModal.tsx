import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Keyboard, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  useCreateTask,
  useRemoveTask,
  useTasksForDate,
  useUpdateTask,
} from "../../../hooks/useTankTasks";
import { useGetActiveTank } from "../../../hooks/useTanks";
import { useModal } from "../../../hooks/useModal";

import { getAppDimensions } from "../../../utility/dimensions";

import { TankTaskForm } from "./Parts/TankTaskForm";
import { TankTaskFormSuccess } from "./Parts/TankTaskFormSuccess";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { selectTaskViewMode } from "../../../store/slices/userConfigSlice";
import {
  selectCurrentDate,
  updatePartialTank,
} from "../../../store/slices/tankSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const TankTaskModal = ({ task, handleBack }) => {
  const { closeModal } = useModal();
  const currentViewMode = useAppSelector(selectTaskViewMode);

  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);

  const [createTask, loading, error] = useCreateTask();
  const [updateTask, updateTaskLoading, updateTaskError] = useUpdateTask();
  const [removeTask, removeTaskLoading] = useRemoveTask();
  const [getTaskForDate] = useTasksForDate();

  const activeTank = useGetActiveTank();

  const tankId = activeTank?.id;

  const handleRemoveTask = async () => {
    await removeTask(task?.id);

    const data = methods.getValues();

    const specialTaskKey = data?.specialTaskKey;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await getTaskForDate(today, activeTank?.id, currentViewMode);

    if (activeTank?.tankProgress === task?.id) {
      dispatch(updatePartialTank({ id: activeTank?.id, tankProgress: null }));
    }

    if (specialTaskKey) {
      dispatch(updatePartialTank({ id: activeTank?.id, specialTaskKey: null }));
    }

    closeModal();
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        name: yup
          .string()
          .required("Please enter a name")
          .max(100, "Name is too long"),
        description: yup.string().max(200).nullable(),
        date: yup.string().required("Please choose a start date"),
        repeat: yup.boolean(),
        expires: yup.boolean(),
        expiresDate: yup.string().when("expires", {
          is: true,
          then: (schema) => schema.required("Please choose a date"),
          otherwise: (schema) => schema.notRequired(),
        }),
        tankId: yup.string().required("Tank ID is required"),
        repeatDays: yup
          .number()
          .integer("Repeat days must be a whole number")
          .typeError("Repeat days must be a number")
          .when("repeat", {
            is: true,
            then: (schema) =>
              schema.required(
                "Please enter the number of days till the next task"
              ),
            otherwise: (schema) => schema.notRequired(),
          }),
        specialTaskKey: yup.string().nullable(),
      })
    ),
    defaultValues: {
      tankId,
      date: currentDate,
      expires: false,
    },
  });

  useEffect(() => {
    if (task) {
      methods.reset({ tankId, ...task });
    }
  }, [task]);

  const editMode = !!task?.id;

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

    const specialTaskKey = data?.specialTaskKey;

    Keyboard.dismiss();

    let task;

    if (editMode) {
      task = await updateTask(data);

      if (!updateTaskLoading && !updateTaskError) {
        if (currentDate) {
          await getTaskForDate(currentDate, activeTank?.id, currentViewMode);
        }

        handleNextStep(1);
      }
    } else {
      task = await createTask(data);

      if (currentDate) {
        await getTaskForDate(currentDate, activeTank?.id, currentViewMode);
      }

      if (!loading && !error) {
        handleNextStep(1);
      }
    }

    if (specialTaskKey) {
      dispatch(
        updatePartialTank({ id: activeTank?.id, tankProgress: task?.id })
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View style={styles.stepContainer}>
          <TankTaskForm
            handleSubmit={handleSubmit}
            loading={loading || updateTaskLoading}
            error={error || updateTaskError}
            editMode={editMode}
            handleRemoveTask={handleRemoveTask}
            removeLoading={removeTaskLoading}
            handleBack={handleBack}
          />
        </View>
        <View style={styles.stepContainer}>
          <TankTaskFormSuccess editMode={editMode} />
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
