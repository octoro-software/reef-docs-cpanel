import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Select,
} from "../../../../components";

import apiClient from "../../../../api/apiClient";
import { setUserProfile } from "../../../../store/slices/globalSlice";
import { useAppDispatch } from "../../../../hooks/useRedux";

import { REEF_DOCS_GREY } from "../../../../constants";
import { useUser } from "../../../../hooks/useAuth";

export const UserMeasurementSection = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const user = useUser();

  const {
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        liquidUnit: yup.string().required("A liquid measurement is required"),
        measurementUnit: yup.string().required("A measurement is required"),
      })
    ),
  });

  useEffect(() => {
    setValue("liquidUnit", user?.liquidUnit);
    setValue("measurementUnit", user?.measurementUnit);
  }, [user]);

  const handlePartialProfileUpdate = async (data) => {
    const response = await apiClient
      .post(`/auth/measurements`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })
      .catch((error) => {
        console.log(error?.response);
        return { error: true };
      });

    return response;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const valid = await trigger();

    if (valid) {
      const data = getValues();

      const response = await handlePartialProfileUpdate(data);

      if (response?.status === 200) {
        dispatch(setUserProfile(response?.data?.data));

        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }

    setLoading(false);
  };

  const [liquid, measurement] = watch(["liquidUnit", "measurementUnit"]);

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
      renderFooter={() => (
        <Button
          onPress={handleSubmit}
          title={success ? "Preferences Saved !" : "Save Preferences"}
          isLoading={loading}
          variant={success ? "success" : "primary"}
        />
      )}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Units and Measurements"
            content="You can update your unit preferences here. Aqua Docs will use your
              preferred units and measurements throughout the app."
            icon="reefDocsMeasurements"
            iconWidth={48}
            iconHeight={48}
          />

          <GridItem>
            <Select
              label="Liquid"
              title="Liquid"
              hasError={errors.liquidUnit?.message}
              options={[
                {
                  label: "Litres",
                  value: "litres",
                },
                {
                  label: "Imperial Gallons",
                  value: "imperialGallons",
                },
                {
                  label: "US Gallons",
                  value: "usGallons",
                },
              ]}
              valueKey={"value"}
              labelKey={"label"}
              value={liquid}
              onConfirm={(value) => setValue("liquidUnit", value)}
            />
          </GridItem>

          <GridItem>
            <Select
              label="Measurement"
              title="Measurement"
              hasError={errors.measurementUnit?.message}
              options={[
                {
                  label: "Centimetres",
                  value: "cm",
                },
                {
                  label: "Inches",
                  value: "inches",
                },
              ]}
              valueKey={"value"}
              labelKey={"label"}
              value={measurement}
              onConfirm={(value) => setValue("measurementUnit", value)}
            />
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});
