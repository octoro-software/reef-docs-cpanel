import React, { useEffect, useMemo } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getAppDimensions } from "../../../utility/dimensions";

import { TestDataResults } from "./Parts/TestDataResults";
import { TestDataComplete } from "./Parts/TestDataComplete";

import apiClient from "../../../api/apiClient";
import { TestDataActions } from "./Parts/TestDataActions";
import { useActiveTankId, useTankList } from "../../../hooks/useTanks";

import {
  HOME_TEST_DEFINITION,
  MAINTENANCE_TEST_REASON_ID,
} from "../../../constants/global";

import {
  useElements,
  useTestHistoryCurrentStanding,
  useTestHistoryForTank,
} from "../../../hooks/useTestHistory";
import { useAudience } from "../../../hooks/useAudience";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectStructuredConfiguration } from "../../../store/slices/structuredConfigurationSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const HomeTestCreateModal = ({ data, quickMenu }) => {
  const { isFresh } = useAudience();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        tankId: yup.string().required("An Tank is required"),
        testResultDate: yup.string().required("A result date is required"),
        testDefinition: yup.string(),
        testReasonId: yup.string(),
        testReasonOther: yup.string().max(300),
        testAction: yup.string(),
        testResults: yup.array(
          yup.object().shape({
            id: yup.string().required("An element is required"),
            readValue: yup
              .number()
              .transform((value, originalValue) => {
                // If the user deletes input, treat empty string as undefined
                return originalValue === "" ? undefined : value;
              })
              .typeError("Must be a number")
              .max(100000, "Must be no more than 100000")
              .min(0, "Must be a positive number")
              .test(
                "max-4-decimals",
                "Only up to 4 decimal places allowed",
                (value) => {
                  if (value === undefined || value === null) return true; // Allow empty input (optional)
                  return /^\d+(\.\d{1,4})?$/.test(value.toString());
                }
              ),

            unit: yup.string(),
            label: yup.string(),
            symbol: yup.string(),
          })
        ),
      })
    ),
    defaultValues: {
      testDefinition: "home",
      testReasonId: "1",
    },
  });

  const [getCurrentStanding] = useTestHistoryCurrentStanding();

  const allTanks = useTankList();

  const tankId = methods.watch("tankId");

  const currentActiveTankId = useActiveTankId();

  const tank =
    allTanks?.find((t) => t.id === tankId) ||
    allTanks?.find((t) => t.id === currentActiveTankId) ||
    allTanks?.[0];

  const [getTestHistoryForTank] = useTestHistoryForTank();

  const editMode = !!data?.id;

  const allElements = useElements();

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

  const { units } = useAppSelector(selectStructuredConfiguration);

  const elements = useMemo(() => {
    return Object.entries(tank?.testingConfig || {})
      .filter(([_, config]) => config?.home === true)
      .map(([key, config]) => {
        const elementData = allElements?.find((e) => e.id === key);
        if (!elementData) return null;

        if (isFresh && !elementData?.freshApplicable) return null;

        return {
          id: key,
          unit:
            config?.unit || units?.find((u) => u.id === config?.unitId)?.name,
          label: elementData?.label,
          symbol: elementData?.symbol,
          groupName: elementData?.groupName,
        };
      })
      .filter(Boolean) // Remove null values
      .sort((a, b) => a?.label?.localeCompare(b?.label));
  }, [tank, allElements]); // Memoization prevents re-renders

  const handleSubmit = async () => {
    const data = await methods.getValues();

    data["testDefinition"] = "home";

    Keyboard.dismiss();

    const response = await apiClient
      .post(editMode ? `/tests/update/${data?.id}` : "/tests/create", data)
      .catch((e) => {
        return JSON.stringify(e);
      });

    const promises = [getTestHistoryForTank(), getCurrentStanding()];

    await Promise.allSettled(promises);

    if (response?.status === 200) {
      handleNextStep(1);
    }
  };

  useEffect(() => {
    if (data?.id) {
      const testResults = elements?.map((element) => {
        const result = data?.results?.find((r) => r.elementId === element.id);
        return {
          ...element,
          readValue: result?.result,
          id: element?.id,
          elementId: element.id,
        };
      });

      return methods.reset({ ...data, testResults });
    }

    if (!tank || !elements.length) return; // Avoid infinite loops

    methods.reset({
      tankId: tank?.id,
      testResultDate: new Date().toDateString(),
      testDefinition: HOME_TEST_DEFINITION,
      testReasonId: MAINTENANCE_TEST_REASON_ID,
      testResults: elements,
    });
  }, [tank?.id, elements.length, data?.id]); // Only re-run when necessary

  return (
    <FormProvider {...methods}>
      <View>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <TestDataResults
              elements={elements}
              handleNextStep={handleNextStep}
              editMode={editMode}
              tanks={allTanks}
              loading={false}
            />
          </View>
          {/* <View style={styles.stepContainer}>
            <TestDataDosing
              elements={elements}
              handleNextStep={handleNextStep}
              step={step}
            />
          </View> */}
          <View style={styles.stepContainer}>
            <TestDataActions
              editMode={editMode}
              handleNextStep={handleNextStep}
              handleSubmit={handleSubmit}
            />
          </View>
          <View style={styles.stepContainer}>
            <TestDataComplete quickMenu={quickMenu} editMode={editMode} />
          </View>
        </Animated.View>
      </View>
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
    width: SCREEN_WIDTH * 4, // Total width for 4 steps
    height: "100%",
  },
});
