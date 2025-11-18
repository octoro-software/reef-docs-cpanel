import React from "react";
import { StyleSheet, View } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useLiveStockPostPhotos } from "../../../hooks/useLiveStock";

import { selectLiveStockProfile } from "../../../store/slices/liveStockSlice";

import { useAppSelector } from "../../../hooks/useRedux";

import { getAppDimensions } from "../../../utility/dimensions";
import { sendEventOnce } from "../../../utility/analytics";

import { LiveStockProfileUserPhotos } from "./Parts/LiveStockProfileUserPhotos";
import { LiveStockProfileUserSelectPhotos } from "./Parts/LiveStockProfileUserSelectPhotos";
import { LiveStockProfileUserPhotoPostSuccess } from "./Parts/LiveStockProfileUserPhotoPostSuccess";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockProfileUserPhotosModal = ({ liveStockId, icon }) => {
  const [postUserPhotos, loading, error] = useLiveStockPostPhotos();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        images: yup
          .array(
            yup.object({
              uri: yup.string().required(),
              type: yup.string(),
              fileName: yup.string(),
            })
          )
          .min(1, "Please provide atleast one image")
          .required(),
      })
    ),
  });

  sendEventOnce("LIVESTOCK_USER_PHOTOS_MODAL_OPEN", {
    liveStockId,
  });

  const experiences = useAppSelector(
    selectLiveStockProfile(liveStockId)
  )?.userImages;

  const data = experiences?.data;

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

    const formData: any = new FormData();
    formData.append("liveStockId", liveStockId);

    if (data.images && Array.isArray(data.images) && data?.images?.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          name: image.fileName || `image_${index}.jpg`,
          type: image.type || "image/jpeg",
        });
      });
    }

    await postUserPhotos(formData);

    handleNextStep(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <FormProvider {...methods}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View
          style={[
            styles.stepContainer,
            { paddingLeft: 0, paddingRight: 0, paddingTop: 0 },
          ]}
        >
          <LiveStockProfileUserPhotos
            handleNextStep={handleNextStep}
            data={data}
            icon={icon}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockProfileUserSelectPhotos
            handleNextStep={handleNextStep}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            icon={icon}
          />
        </View>
        <View style={styles.stepContainer}>
          <LiveStockProfileUserPhotoPostSuccess icon={icon} />
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
