import React, { useEffect, useState, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RNFS from "react-native-fs";

import { selectTanks } from "../../../store/slices/tankSlice";

import { getAppDimensions } from "../../../utility/dimensions";

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { useGetTestHistory } from "../../../hooks/useTestHistory";
import {
  useCreatePost,
  useGetPost,
  useUpdatePost,
} from "../../../hooks/usePosts";

import { HelpPostContent } from "./Parts/HelpPostContent";
import { HelpPostMedia } from "./Parts/HelpPostMedia";
import { HelpPostAdditionalInfo } from "./Parts/HelpPostAdditionalInfo";
import { HelpPostComplete } from "./Parts/HelpPostComplete";
import {
  selectUrgentPostAvailable,
  setUrgentPostAvailable,
} from "../../../store/slices/globalSlice";
import apiClient from "../../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = getAppDimensions().width;

export const HelpPostModal = ({
  classification,
  icon,
  taggable,
  edit = false,
  postId,
  title,
  description,
  placeholder,
  defaultValue,
}) => {
  const [getTests] = useGetTestHistory();

  const dispatch = useAppDispatch();

  const [postDiseaseIdentification] = useCreatePost();

  const [getPost] = useGetPost();

  const [updatePost] = useUpdatePost();

  const tanks = useAppSelector(selectTanks);

  const urgentPostAvailable = useAppSelector(selectUrgentPostAvailable);

  const handleGetPost = async () => {
    const response = await getPost(postId);

    methods.reset({
      content: response?.content,
      tankId: response?.tankId,
      shareTank: response?.shareTank,
      testId: response?.testId,
      shareTest: response?.shareTest,
      disableComments: response?.disableComments,
      disableNotifications: response?.disableNotifications,
      classification: response?.classification,
      images: response?.images || [],
      videos: response?.videos || [],
      imagesToUpload: [],
      tags: response?.tags || [],
    });
  };

  useEffect(() => {
    if (edit) {
      handleGetPost();
    }
  }, [edit]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        content: yup
          .string()
          .min(10)
          .max(2400)
          .required("The content is required"),
        tankId: yup.string(),
        shareTank: yup.boolean(),
        testId: yup.string(),
        shareTest: yup.boolean(),
        disableComments: yup.boolean(),
        disableNotifications: yup.boolean(),
        classification: yup.string(),
        urgent: yup.boolean(),
        images: yup.array(),
        imagesToUpload: yup
          .array(
            yup.object({
              uri: yup.string().required(),
              type: yup.string(),
              fileName: yup.string(),
            })
          )
          .max(4, "Please provide at most four images"),
        videos: yup.array(
          yup.object({
            uri: yup.string().required(),
            type: yup.string(),
            fileName: yup.string(),
          })
        ),
      })
    ),
    defaultValues: {
      shareTank: true,
      shareTest: true,
      disableComments: false,
      disableNotifications: false,
      classification,
    },
  });

  const handleCheckLastShareValues = async () => {
    const shareTank = await AsyncStorage.getItem("shareTank");
    const shareTest = await AsyncStorage.getItem("shareTest");

    if (shareTank !== null) {
      methods.setValue("shareTank", shareTank === "true");
    }
    if (shareTest !== null) {
      methods.setValue("shareTest", shareTest === "true");
    }
  };

  const [postSearchResults, setPostSearchResults] = useState([]);
  const [content] = methods.watch(["content"]);

  const handleGetPostSearchResults = async () => {
    const response = await apiClient.get(
      `/search/userPostSearch?search=${content}`
    );

    setPostSearchResults(response.data?.data?.posts);
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleGetPostSearchResults();
    }, 500);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [content]);

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

  const convertVideosAndSubmit = async () => {
    const data = methods.getValues();
    const formData: any = new FormData();

    // Append text fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== "imagesToUpload" &&
        key !== "images" &&
        key !== "videos" &&
        key !== "tags"
      ) {
        formData.append(key, String(value)); // Ensure values are strings
      }
    });

    if (data?.videos?.length > 0) {
      const orientation =
        data.videos[0]?.width >= data.videos[0]?.height
          ? "horizontal"
          : "vertical";

      formData.append("videoOrientation", orientation);
    }

    if (
      data.imagesToUpload &&
      Array.isArray(data.imagesToUpload) &&
      data?.imagesToUpload?.length > 0
    ) {
      data.imagesToUpload.forEach((image, index) => {
        RNFS.exists(image.uri).then((exists) => {
          if (exists) {
            console.log("Image exists at path:", image.uri);
          } else {
            console.log("Image does not exist at path:", image.uri);
          }
        });

        formData.append(`imagesToUpload[${index}]`, {
          uri: image.uri,
          name: image.fileName || `image_${index}.jpg`,
          type: image.type || "image/jpeg",
        });
      });
    }

    formData.append("images", JSON.stringify(data.images || []));
    formData.append("tags", JSON.stringify(data?.tags || []));
    edit && formData.append("videos", JSON.stringify(data.videos || []));

    edit
      ? await updatePost(formData, data?.videos, postId)
      : await postDiseaseIdentification(formData, data?.videos, data?.urgent);

    try {
      if (data?.urgent) {
        dispatch(setUrgentPostAvailable(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    convertVideosAndSubmit();

    handleNextStep();
  };

  const initialValue = methods.getValues("content");

  const handleGetTestsForTank = async (tankId: string) =>
    await getTests({ type: "all", tankId, limit: 12, referenceIndex: true });

  const handleTankSelection = async (tankId: string) => {
    methods.setValue("tankId", tankId);

    const testResults = await handleGetTestsForTank(tankId);

    if (testResults) {
      methods.setValue("testId", testResults?.[0]?.id);
    } else {
      methods.setValue("testId", null);
    }
  };

  useEffect(() => {
    if (initialValue?.length === 0 && postSearchResults?.length > 0) {
      setPostSearchResults([]);
    }
  }, [initialValue, postSearchResults]);

  useEffect(() => {
    if (defaultValue) {
      methods.setValue("content", defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (tanks?.length > 0) {
      const tankId = tanks?.[0]?.id;

      handleTankSelection(tankId);
    }
  }, [tanks]);

  useEffect(() => {
    handleCheckLastShareValues();
  }, []);

  const hasTanks = tanks?.length > 0;

  return (
    <FormProvider {...methods}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <HelpPostContent
              handleNextStep={handleNextStep}
              icon={icon}
              taggable={taggable}
              title={title}
              description={description}
              placeholder={placeholder}
              postSearchResults={postSearchResults}
              edit={edit}
            />
          </View>
          <View style={styles.stepContainer}>
            <HelpPostMedia
              handleNextStep={hasTanks ? handleNextStep : handleSubmit}
              handleBack={handleBack}
              icon={icon}
              edit={edit}
            />
          </View>
          {hasTanks && (
            <View style={styles.stepContainer}>
              <HelpPostAdditionalInfo
                handleNextStep={handleSubmit}
                handleBack={handleBack}
                handleTankSelection={handleTankSelection}
                icon={icon}
                urgentAvailable={urgentPostAvailable}
                edit={edit}
              />
            </View>
          )}

          <View style={styles.stepContainer}>
            <HelpPostComplete icon={icon} edit={edit} />
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
