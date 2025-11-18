import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { CsvImportFileBrowseModal } from "./Parts/CsvImportFileBrowseModal";
import { CsvImportColumnMapper } from "./Parts/CsvImportColumnMapper";

import { pickDocument } from "../../../utility/camera";
import { getAppDimensions } from "../../../utility/dimensions";

const SCREEN_WIDTH = getAppDimensions().width;

export const TestHistoryCsvImportModal = () => {
  const methods = useForm({
    defaultValues: {
      headers: true,
    },
    resolver: yupResolver(
      yup.object().shape({
        file: yup.object({
          uri: yup.string().required(),
          type: yup.string(),
          fileName: yup.string(),
        }),
        headers: yup.boolean(),
      })
    ),
  });
  const [step, setStep] = React.useState(0);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleBack = () => handleNextStep(step - 2);

  const handleCheckFileUpload = async () => {
    const result = await methods.trigger("file.uri");

    if (result) {
      handleNextStep(1);
    }
  };

  const handleFileBrowse = async () => {
    const result = await pickDocument({
      type: [
        "text/csv",
        "application/csv",
        "application/xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    });

    methods.setValue("file", result?.assets?.[0]);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <CsvImportFileBrowseModal
              handleFileBrowse={handleFileBrowse}
              handleCheckFileUpload={handleCheckFileUpload}
            />
          </View>
          <View style={styles.stepContainer}>
            <CsvImportColumnMapper handleNextStep={handleNextStep} />
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
    width: SCREEN_WIDTH * 4, // Total width for 4 steps
    height: "100%",
  },
});
