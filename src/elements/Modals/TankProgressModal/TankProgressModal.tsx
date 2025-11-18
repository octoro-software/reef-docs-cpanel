import React, { useEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { getAppDimensions } from "../../../utility/dimensions";
import { format } from "date-fns";
import * as Localization from "expo-localization";

import { TankProgressMedia } from "./Parts/TankProgressMedia";
import { TankProgressInformation } from "./Parts/TankProgressInformation";
import { TankProgressComplete } from "./Parts/TankProgressComplete";

import {
  useAddTankProgress,
  useDeleteTankProgress,
  useGetActiveTank,
  useGetFreshTankProgress,
  useUpdateTankProgress,
} from "../../../hooks/useTanks";
import { useModal } from "../../../hooks/useModal";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectTankProgress } from "../../../store/slices/tankSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const TankProgressModal = ({
  icon = "reefDocsProgress",
  edit = false,
  item,
}) => {
  const [addTankProgress, addTankProgressLoading] = useAddTankProgress();
  const [updateTankProgress, updateTankProgressLoading] =
    useUpdateTankProgress();
  const [deleteTankProgress, deleteTankProgressLoading] =
    useDeleteTankProgress();

  const [refreshTankProgress] = useGetFreshTankProgress();

  const { sortBy } = useAppSelector(selectTankProgress);

  const { closeModal } = useModal();

  const activeTank = useGetActiveTank();

  // Get today's date in the user's current timezone, formatted as YYYY-MM-DD
  const getTodayLocal = () => {
    try {
      const now = new Date();
      // Use the user's current timezone if available
      if (Localization.timezone) {
        // This is a workaround, JS Date uses system timezone, so just format as local
        return format(now, "yyyy-MM-dd");
      }
      return format(now, "yyyy-MM-dd");
    } catch (e) {
      return "";
    }
  };

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        description: yup.string().max(1200),
        tankId: yup.string(),
        date: yup.string(),
        images: yup
          .array(
            yup.object({
              uri: yup.string().required(),
              type: yup.string(),
              fileName: yup.string(),
            })
          )
          .max(1, "Please provide at most one image"),
      })
    ),
    defaultValues: {
      date: getTodayLocal(),
    },
  });

  useEffect(() => {
    if (edit) {
      methods.reset(item);
    }
  }, []);

  const [step, setStep] = React.useState(0);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNextStep = (increment = 1) => {
    Keyboard.dismiss();

    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleBack = (increment = 2) => handleNextStep(increment);

  const handleSubmit = async () => {
    const data = methods.getValues();
    const formData: any = new FormData();

    // Append text fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== "images") {
        formData.append(key, String(value)); // Ensure values are strings
      }
    });

    // Append image files properly
    if (data.images && Array.isArray(data.images) && data?.images?.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          name: image.fileName || `image_${index}.jpg`,
          type: image.type || "image/jpeg",
        });
      });
    }

    formData.append("tankId", activeTank?.id);

    edit
      ? await updateTankProgress(formData, data?.id)
      : await addTankProgress(formData);

    await refreshTankProgress(activeTank?.id, 1, sortBy);

    handleNextStep();
  };

  const handleDeleteProgress = async (id) => {
    await deleteTankProgress(id);

    closeModal();
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <TankProgressMedia
              edit={edit}
              handleNextStep={handleNextStep}
              icon={icon}
              handleDeleteProgress={handleDeleteProgress}
              deleteTankProgressLoading={deleteTankProgressLoading}
            />
          </View>

          <View style={styles.stepContainer}>
            <TankProgressInformation
              handleNextStep={handleSubmit}
              handleBack={handleBack}
              loading={addTankProgressLoading}
              updateTankProgressLoading={updateTankProgressLoading}
            />
          </View>

          <View style={styles.stepContainer}>
            <TankProgressComplete icon={icon} edit={edit} />
          </View>
        </Animated.View>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  stepContainer: {
    width: SCREEN_WIDTH,
    padding: 16,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 5, // Total width for 4 steps
    height: "100%",
  },
});
