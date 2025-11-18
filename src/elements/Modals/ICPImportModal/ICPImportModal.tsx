import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import RNFS from "react-native-fs";
import NetInfo from "@react-native-community/netinfo";
import { FormProvider, useForm } from "react-hook-form";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ICPImportVideo } from "./Parts/ICPImportVideo";
import { ICPImportGuide } from "./Parts/ICPImportGuide";
import { ICPImportComplete } from "./Parts/ICPImportComplete";
import { ICPImportProviderSelect } from "./Parts/ICPImportProviderSelectForm";
import { ICPImportResultPreview } from "./Parts/ICPImportResultPreview";
import { ICPImportResultRoPreview } from "./Parts/ICPImportResultRoPreview";
import { ICPImportSummary } from "./Parts/ICPImportSummary";

import apiClient from "../../../api/apiClient";

import { API_BASE_URL } from "../../../constants";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  selectTestingUserConfig,
  setTestingLastIcpProvider,
} from "../../../store/slices/userConfigSlice";
import { selectIcpProviders } from "../../../store/slices/IcpSlice";
import { selectActiveTank, selectTanks } from "../../../store/slices/tankSlice";
import { getAppDimensions } from "../../../utility/dimensions";

const SCREEN_WIDTH = getAppDimensions().width;

export const ICPImportModal = ({}) => {
  const activeTank = useSelector(selectActiveTank);
  const icpProviders = useAppSelector(selectIcpProviders);

  const tanks = useAppSelector(selectTanks);
  const { lastIcpProvider } = useAppSelector(selectTestingUserConfig);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        testTypeId: yup.string().required("A test type is required"),
        providerId: yup.string().required("An ICP Provider is required"),
        tankId: yup.string().required("An Tank is required"),
        testSentDate: yup.string().required("A sent date is required"),
        testResultDate: yup.string().required("A result date is required"),
        testDefinition: yup.string(),
        media: yup.object({
          uri: yup.string().required(),
          type: yup.string(),
          fileName: yup.string(),
        }),
        roMedia: yup.object({
          uri: yup.string(),
          type: yup.string(),
          fileName: yup.string(),
        }),
      })
    ),
    defaultValues: {
      testDefinition: "icp",
    },
  });

  const [icpProvider, setIcpProvider] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [guide, setGuide] = React.useState(false);
  const [manualImport, setManualImport] = React.useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressRo, setUploadProgressRo] = useState(0);

  const dispatch = useAppDispatch();

  const [uploadingElements, setUploadingElements] = useState(false);
  const [uploadingRo, setUploadingRo] = useState(false);

  const translateX = useSharedValue(0);

  const [providerProductId] = methods.watch(["testTypeId"]);

  const { includesRo } = icpProvider?.products.find(
    (p) => p.id === providerProductId
  ) || { includesRo: false };

  const handleNextStep = (increment = 1) => {
    translateX.value = withTiming(-(step + increment) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + increment);
  };

  const handleBack = (increment = 2) => handleNextStep(increment);

  const handleGuideNavigate = () => {
    setGuide(true);
    handleNextStep();
  };

  const handleGuideBack = () => {
    handleNextStep(-1);
    setTimeout(() => {
      setGuide(false);
    }, 2000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const determineChunkSize = async () => {
    const networkState = await NetInfo.fetch();
    return networkState.isWifiEnabled ? 1024 * 1024 * 2 : 1024 * 1024 * 2; // 10MB for WiFi, 2MB for mobile
  };

  const handleVideoUpload = async (file, jobId, hasRo, isRo) => {
    if (isRo) {
      setUploadingRo(true);
    } else {
      setUploadingElements(true);
    }

    const chunkSize = await determineChunkSize();
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    const totalChunks = Math.ceil(fileInfo.size / chunkSize);
    const fileId = new Date().getTime();

    const savedProgress = await AsyncStorage.getItem(`upload_${fileId}`);
    const startChunk = savedProgress ? JSON.parse(savedProgress).chunkIndex : 0;

    let completedChunks = startChunk; // Track completed chunks

    const updateProgress = () => {
      const rawProgress = (completedChunks / totalChunks) * 100;
      const finalProgress =
        completedChunks === totalChunks ? 100 : Math.floor(rawProgress);
      isRo
        ? setUploadProgressRo(finalProgress)
        : setUploadProgress(finalProgress);
    };

    const uploadChunk = async (chunkIndex) => {
      try {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, fileInfo.size);
        const chunk = await RNFS.read(file.uri, end - start, start, "base64");

        const formData = new FormData();
        formData.append("name", file.name);
        formData.append("type", file.mimeType);
        formData.append("binary", chunk);
        formData.append("chunk_index", chunkIndex);
        formData.append("total_chunks", totalChunks);
        formData.append("file_id", fileId);
        formData.append("extension", file.type?.replace("video/", ""));
        formData.append("jobId", jobId);
        formData.append("hasRo", hasRo);
        formData.append("isRo", isRo);

        const response = await apiClient.post(
          `${API_BASE_URL}/icp/video/chunk`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );

        if (response?.data?.status === "Chunk uploaded successfully") {
          completedChunks++;
          updateProgress();
          await AsyncStorage.setItem(
            `upload_${fileId}`,
            JSON.stringify({ chunkIndex })
          );
        }

        if (response?.data?.status === "File uploaded successfully") {
          completedChunks = totalChunks;
          updateProgress();
          return true;
        }

        return true;
      } catch (error) {
        console.error(`Chunk upload failed: ${error.message}`);
        throw error;
      }
    };

    const uploadChunksInParallel = async () => {
      const chunkPromises = [];

      for (let i = startChunk; i < totalChunks; i++) {
        chunkPromises.push(uploadChunk(i));
      }

      await Promise.all(chunkPromises);
      updateProgress();
      AsyncStorage.removeItem(`upload_${fileId}`); // Cleanup progress

      isRo ? setUploadProgressRo(100) : setUploadProgress(100);
    };

    await uploadChunksInParallel();
  };

  const handleProcess = async () => {
    try {
      const data = methods.getValues();

      const formData: any = new FormData();

      const formPayload = { ...data };

      delete formPayload.media;

      formData.append("formData", JSON.stringify(formPayload));

      const response = await apiClient.post(`/icp/import/video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        const hasRo = data?.roMedia?.uri ? true : false;

        await handleVideoUpload(
          data.media,
          response?.data?.data?.jobId,
          hasRo,
          false
        );

        if (hasRo) {
          await handleVideoUpload(
            data.roMedia,
            response?.data?.data?.jobId,
            hasRo,
            true
          );
        }

        handleNextStep();
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleManualImport = () => {
    setManualImport(true);
    handleNextStep();
  };

  const handleVideoImport = () => {
    setManualImport(false);
    handleNextStep();
  };

  useEffect(() => {
    if (activeTank) {
      methods.setValue("tankId", activeTank);
    }
  }, [activeTank]);

  const handleConfirmProvider = (value: string) => {
    const chosenProviderOption = icpProviders?.find(
      (option) => option.id === value
    );
    methods.setValue("providerId", value);
    dispatch(setTestingLastIcpProvider(value));
    setIcpProvider(chosenProviderOption);
  };

  useEffect(() => {
    if (lastIcpProvider) {
      handleConfirmProvider(lastIcpProvider);
    }
  }, [lastIcpProvider]);

  return (
    <FormProvider {...methods}>
      <View>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <ICPImportProviderSelect
              handleManualImport={handleManualImport}
              handleConfirmProvider={handleConfirmProvider}
              tanks={tanks}
              icpProviders={icpProviders}
              handleVideoImport={handleVideoImport}
              icpProvider={icpProvider}
            />
          </View>
          <View style={styles.stepContainer}>
            {manualImport ? (
              <ICPImportResultPreview
                handleNextStep={handleNextStep}
                manualImport={manualImport}
                icpProvider={icpProvider}
                handleBack={handleBack}
                includesRo={includesRo}
              />
            ) : (
              <ICPImportVideo
                handleProcess={handleProcess}
                handleGuideNavigate={handleGuideNavigate}
                icpProvider={icpProvider}
                handleBack={handleBack}
                includesRo={includesRo}
                uploadProgress={uploadProgress}
                uploading={uploadingElements}
                roUploading={uploadingRo}
                roUploadProgress={uploadProgressRo}
              />
            )}
          </View>
          <View style={styles.stepContainer}>
            {guide ? (
              <ICPImportGuide handleGuideBack={handleGuideBack} />
            ) : includesRo && manualImport ? (
              <ICPImportResultRoPreview
                handleNextStep={handleNextStep}
                manualImport={manualImport}
                icpProvider={icpProvider}
                handleBack={handleBack}
                includesRo={includesRo}
              />
            ) : (
              <ICPImportComplete icpProvider={icpProvider} />
            )}
          </View>
          <View style={styles.stepContainer}>
            <ICPImportSummary
              handleBack={handleBack}
              icpProvider={icpProvider}
            />
          </View>
          <View style={styles.stepContainer}>
            {manualImport ? (
              <ICPImportComplete icpProvider={icpProvider} />
            ) : (
              <ICPImportComplete icpProvider={icpProvider} />
            )}
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
