import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getAppDimensions } from "../../../utility/dimensions";

import { useAppSelector } from "../../../hooks/useRedux";
import {
  useGetActiveTank,
  useUpdateTankTestingConfig,
} from "../../../hooks/useTanks";

import { selectStructuredConfiguration } from "../../../store/slices/structuredConfigurationSlice";

import { TestingParameters } from "./Parts/TestingParameters";
import { TestingParametersHelp } from "./Parts/TestingParametersHelp";
import { TestingParameterForm } from "./Parts/TestingParameterForm";
import { useElements } from "../../../hooks/useTestHistory";
import { useAudience } from "../../../hooks/useAudience";

const SCREEN_WIDTH = getAppDimensions().width;

export const TestSettingsModal = ({}) => {
  const [activeItem, setActiveItem] = useState(null);

  const { isFresh } = useAudience();

  const [activeMenu, setActiveMenu] = useState("Home");

  const menu = isFresh ? ["Home"] : ["Home", "ICP", "NDOC"];

  const [updateStructuredConfiguration, loading, error, success] =
    useUpdateTankTestingConfig();

  const elements = useElements();

  const activeTank = useGetActiveTank();

  const structuredConfiguration = useAppSelector(selectStructuredConfiguration);

  const homeTestCards = elements
    ?.filter((e) => e.isHomeTest)
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const icpCards = elements
    ?.filter((e) => e.isIcp)
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const roCards = elements
    ?.filter((e) => e.isRoElement)
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const ndocCards = elements
    ?.filter((e) => e.isNdoc)
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const homeTestCardIds = new Set(homeTestCards?.map((card) => card.id));
  const uniqueIcpCards = icpCards?.filter(
    (card) => !homeTestCardIds.has(card.id)
  );

  const freshCards = [...homeTestCards, ...uniqueIcpCards]?.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const data =
    activeMenu === "Home"
      ? isFresh
        ? freshCards
        : homeTestCards
      : activeMenu === "ICP"
        ? icpCards
        : activeMenu === "RO"
          ? roCards
          : activeMenu === "NDOC"
            ? ndocCards
            : [];

  const generateSchema = () => {
    const shape = {};

    elements?.forEach((card) => {
      shape[card.id] = yup.object().shape({
        rangeHigh: yup
          .number()
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
          )
          .required("Please enter a range high value"),
        rangeLow: yup
          .number()
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
          )
          .required("Please enter a range low value"),
        target: yup
          .number()
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
          )
          .required("Please enter a target value"),
        elementId: yup.string().required("Required"),
        home: yup.boolean(),
        unitId: yup.string().nullable(),
        kitId: yup.string().nullable(),
        dosingProductId: yup.string().nullable(),
        dosingEnabled: yup.boolean(),
        maxDailyDosage: yup
          .number()
          .typeError("Must be a number")
          .max(10000, "Must be no more than 10000")
          .min(0, "Must be a positive number")
          .test(
            "max-4-decimals",
            "Only up to 4 decimal places allowed",
            (value) => {
              if (value === undefined || value === null) return true;
              return /^\d+(\.\d{1,4})?$/.test(value.toString());
            }
          )
          .when("autoCalculate", {
            is: true,
            then: (schema) =>
              schema.required("This field is required when dosing is enabled"),
            otherwise: (schema) => schema.notRequired(),
          }),
        dosingAmountUnit: yup.string().when("autoCalculate", {
          is: true,
          then: (schema) =>
            schema.required("This field is required when dosing is enabled"),
          otherwise: (schema) => schema.notRequired(),
        }),

        dosingAmount: yup
          .number()
          .typeError("Must be a number")
          .max(10000, "Must be no more than 10000")
          .min(0, "Must be a positive number")
          .test(
            "max-4-decimals",
            "Only up to 4 decimal places allowed",
            (value) => {
              if (value === undefined || value === null) return true;
              return /^\d+(\.\d{1,4})?$/.test(value.toString());
            }
          )
          .when("autoCalculate", {
            is: true,
            then: (schema) =>
              schema.required("This field is required when dosing is enabled"),
            otherwise: (schema) => schema.notRequired(),
          }),
        dosingConcentrationIncreaseAmount: yup
          .number()
          .typeError("Must be a number")
          .max(10000, "Must be no more than 10000")
          .min(0, "Must be a positive number")
          .test(
            "max-4-decimals",
            "Only up to 4 decimal places allowed",
            (value) => {
              if (value === undefined || value === null) return true; // Allow empty input (optional)
              return /^\d+(\.\d{1,4})?$/.test(value.toString());
            }
          )
          .when("autoCalculate", {
            is: true,
            then: (schema) =>
              schema.required("This field is required when dosing is enabled"),
            otherwise: (schema) => schema.notRequired(),
          }),
        dosingExampleVolume: yup
          .number()
          .typeError("Must be a number")
          .max(10000, "Must be no more than 10000")
          .min(0, "Must be a positive number")
          .test(
            "max-4-decimals",
            "Only up to 4 decimal places allowed",
            (value) => {
              if (value === undefined || value === null) return true; // Allow empty input (optional)
              return /^\d+(\.\d{1,4})?$/.test(value.toString());
            }
          )
          .when("autoCalculate", {
            is: true,
            then: (schema) =>
              schema.required("This field is required when dosing is enabled"),
            otherwise: (schema) => schema.notRequired(),
          }),
      });
    });

    return yup.object().shape(shape);
  };

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(generateSchema()),
  });

  const [step, setStep] = React.useState(0);

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

    await updateStructuredConfiguration(data, activeTank?.id);
  };

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    let data = { ...activeTank?.testingConfig };

    homeTestCards?.map((card) => {
      if (!data[card?.id]) {
        data[card?.id] = {
          rangeHigh: card?.rangeHigh,
          rangeLow: card?.rangeLow,
          target: card?.target,
          elementId: card?.id,
          home: card?.isHomeTest,
          icp: card?.icp,
          unitId: card?.baseTargetsUnit,
          kitId: null,
          dosingProductId: null,
          notInTank: true,
        };
      }
    });
    icpCards?.map((card) => {
      if (!data[card?.id]) {
        data[card?.id] = {
          rangeHigh: card?.rangeHigh,
          rangeLow: card?.rangeLow,
          target: card?.target,
          elementId: card?.id,
          home: card?.isHomeTest,
          icp: card?.icp,
          unitId: card?.baseTargetsUnit,
          kitId: null,
          dosingProductId: null,
        };
      }
    });
    roCards?.map((card) => {
      if (!data[card?.id]) {
        data[card?.id] = {
          rangeHigh: card?.rangeHigh,
          rangeLow: card?.rangeLow,
          target: card?.target,
          elementId: card?.id,
          home: card?.isHomeTest,
          icp: card?.icp,
          unitId: card?.baseTargetsUnit,
          kitId: null,
          dosingProductId: null,
        };
      }
    });
    ndocCards?.map((card) => {
      if (!data[card?.id]) {
        data[card?.id] = {
          rangeHigh: card?.rangeHigh,
          rangeLow: card?.rangeLow,
          target: card?.target,
          elementId: card?.id,
          home: card?.isHomeTest,
          icp: card?.icp,
          unitId: card?.baseTargetsUnit,
          isNdoc: card?.isNdoc,
          kitId: null,
          dosingProductId: null,
        };
      }
    });

    methods.reset(data);
  }, [activeTank]);

  const handleMenuPress = (item) => {
    setActiveItem(item);

    handleNextStep(1);
  };

  console.log(methods.formState.errors);

  return (
    <FormProvider {...methods}>
      <View>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <TestingParameters
              handleNextStep={() => handleNextStep(2)}
              elements={data}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              success={success}
              handleMenuPress={handleMenuPress}
              errors={methods.formState.errors}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              menu={menu}
            />
          </View>
          <View style={styles.stepContainer} key={activeItem?.elementId}>
            {activeItem && (
              <TestingParameterForm
                key={activeItem?.elementId}
                handleNextStep={handleNextStep}
                item={activeItem}
                structuredConfiguration={structuredConfiguration}
                errors={methods.formState.errors}
                activeMenu={activeMenu}
              />
            )}
          </View>
          <View style={styles.stepContainer}>
            <TestingParametersHelp handleNextStep={handleNextStep} />
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
    width: SCREEN_WIDTH * 2,
    height: "100%",
  },
});
