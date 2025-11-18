import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FormProvider, useForm } from "react-hook-form";
import { Dimensions, StyleSheet, View } from "react-native";

import { selectIcpProviders } from "../../../store/slices/IcpSlice";

import { useAppSelector } from "../../../hooks/useRedux";

import { ICPImportResultPreview } from "../ICPImportModal/Parts/ICPImportResultPreview";
import { ICPImportPreviewJobsModal } from "./Parts/ICPImportPreviewJobsModal";
import { ICPImportPreviewConfirmComplete } from "../ICPImportModal/Parts/ICPImportPreviewConfirmComplete";

import apiClient from "../../../api/apiClient";

import { API_BASE_URL } from "../../../constants";
import { getAppDimensions } from "../../../utility/dimensions";

const SCREEN_WIDTH = getAppDimensions().width;

export const ICPImportPreviewModal = () => {
  const [icpProvider, setIcpProvider] = React.useState(null);
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = React.useState(0);
  const translateX = useSharedValue(0);

  const providers = useAppSelector(selectIcpProviders);

  const [activeJob, setActiveJob] = useState(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const [data, setData] = useState([]);

  const handleLoadLastJob = async () => {
    const response = await apiClient
      .get(`${API_BASE_URL}/icp/import/latestJob`)
      .catch((error) => {
        console.log(error);
      });

    if (response.status === 200) {
      setData(response?.data?.data);
    }
  };

  const handleSubmitPreview = async () => {
    setLoading(true);

    const formData = methods.getValues();

    const payload = {
      ...formData,
      ...activeJob.formData,
      jobId: activeJob?.jobId,
    };

    const response = await apiClient
      .post(`${API_BASE_URL}/icp/upload/confirm`, payload)
      .catch((err) => console.log(JSON.stringify(err)));

    if (response?.status === 200) {
      handleNextStep();
    }
  };

  useEffect(() => {
    handleLoadLastJob();
  }, []);

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleJobSelect = (job) => {
    if (job.statusId === 3) {
      const provider = providers.find(
        (provider) => provider.id === job.formData?.providerId
      );

      setIcpProvider(provider);

      setActiveJob(job);

      handleNextStep();
    }
  };

  const handleBack = () => handleNextStep(step - 2);

  return (
    <FormProvider {...methods}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <ICPImportPreviewJobsModal
              jobs={data}
              handleJobSelect={handleJobSelect}
            />
          </View>
          <View style={styles.stepContainer}>
            <ICPImportResultPreview
              handleBack={handleBack}
              handleSubmitPreview={handleSubmitPreview}
              icpProvider={icpProvider}
              data={activeJob?.tankResults}
              loading={loading}
              handleNextStep={handleNextStep}
            />
          </View>
          <View style={styles.stepContainer}>
            <ICPImportPreviewConfirmComplete icpProvider={icpProvider} />
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
