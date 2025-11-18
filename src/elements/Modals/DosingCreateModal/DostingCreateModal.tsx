import React, { useEffect, useMemo, useState } from "react";
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

import { DosingResults } from "./Parts/DosingResults";
import { TestDataComplete } from "./Parts/TestDataComplete";

import apiClient from "../../../api/apiClient";
import { useActiveTankId, useTankList } from "../../../hooks/useTanks";

import {
  useElements,
  useTestHistoryCurrentStanding,
  useTestHistoryForTank,
} from "../../../hooks/useTestHistory";

const SCREEN_WIDTH = getAppDimensions().width;

export const DosingCreateModal = ({ edit, id, quickMenu, recordId }) => {
  const data = {};

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        tankId: yup.string().required("An Tank is required"),
        dosageDate: yup.string().required("A result date is required"),
        dosageResults: yup.array(
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
  });

  const [loading, setLoading] = useState(false);

  const [getCurrentStanding] = useTestHistoryCurrentStanding();

  const tanks = useTankList();

  const tankId = methods.watch("tankId");

  const currentActiveTankId = useActiveTankId();

  const allTanks = tanks?.filter(
    (tank) => !["rodi_reservoir", "saltwater_reservoir"].includes(tank?.type)
  );

  const tank =
    allTanks?.find((t) => t.id === tankId) ||
    allTanks?.find((t) => t.id === currentActiveTankId) ||
    allTanks?.[0];

  const [getTestHistoryForTank] = useTestHistoryForTank();

  const editMode = edit;

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

  const elements = useMemo(() => {
    return Object.entries(tank?.testingConfig || {})
      .map(([key, config]) => {
        const elementData = allElements?.find((e) => e.id === key);
        return {
          id: key,
          unit: config?.unit,
          label: elementData?.label,
          symbol: elementData?.symbol,
          groupName: elementData?.groupName,
          canDose: elementData?.canDose,
        };
      })
      .sort((a, b) => a.label?.localeCompare(b.label));
  }, [tank, allElements]); // Memoization prevents re-renders

  const handleSubmit = async () => {
    setLoading(true);

    const data = await methods.getValues();

    Keyboard.dismiss();

    const response = await apiClient
      .post(editMode ? `/dosage/update/${data?.id}` : "/dosage/create", data)
      .catch((e) => {
        return JSON.stringify(e);
      });

    const promises = [getTestHistoryForTank(), getCurrentStanding()];

    await Promise.allSettled(promises);

    setLoading(false);

    if (response?.status === 200) {
      handleNextStep(1);
    }
  };

  const getDosageResults = async () => {
    const results = await apiClient.get(`/dosage/${id}`);

    const data = results?.data?.data;

    const dosageResults = elements
      ?.filter((e) => e.canDose)
      ?.map((element) => {
        const result = data?.results?.find((r) => r.elementId === element.id);
        return {
          ...element,
          readValue: result?.result,
          id: element?.id,
          elementId: element.id,
        };
      });

    return methods.reset({ ...data, dosageResults });
  };

  useEffect(() => {
    if (id) {
      getDosageResults();
    }
  }, [id]);

  useEffect(() => {
    if (!tank || !elements.length) return; // Avoid infinite loops

    methods.reset({
      tankId: tank?.id,
      dosageDate: new Date().toDateString(),
      dosageResults: elements?.filter((e) => e.canDose),
    });
  }, [tank?.id, elements.length, data?.id]); // Only re-run when necessary

  return (
    <FormProvider {...methods}>
      <View>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <DosingResults
              handleNextStep={handleSubmit}
              tanks={allTanks}
              loading={false}
              title="Enter Dosages"
              content="Enter your dosing amounts below. Ignore any fields you are not dosing for."
              editMode={editMode}
              recordId={recordId}
              updateLoading={loading}
            />
          </View>

          <View style={styles.stepContainer}>
            <TestDataComplete quickMenu={quickMenu} />
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
    width: SCREEN_WIDTH * 2, // Total width for 4 steps
    height: "100%",
  },
});
