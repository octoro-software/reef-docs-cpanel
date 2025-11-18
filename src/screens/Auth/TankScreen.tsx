import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useMarkTankOnBoarded, useUser } from "../../hooks/useAuth";

import {
  Button,
  Grid,
  Heading,
  TextInput,
  ProgressBar,
  Icon,
  DateSelect,
  Select,
} from "../../components";

import { useCreateTank } from "../../hooks/useTanks";

import { AppImage } from "../../components/AppImage/AppImage";
import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";

import { NOTIFICATIONS_PATH, REEF_DOCS_GREY } from "../../constants";
import { useCameraOrMedia } from "../../utility/camera";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export const TankScreen: React.FC = () => {
  const [handleMarkTankOnboarded] = useMarkTankOnBoarded();

  const [createTank] = useCreateTank();

  const user = useUser();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isLoading },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("A Tank Name is Required").max(60),
        setupDate: yup.string(),
        volume: yup
          .number()
          .typeError("Please enter a valid number")
          .positive("Volume must be a positive number")
          .max(99999, "Volume must be less than 99999")
          .required("A system volume is required"),
        imageUri: yup.string(),
        imageType: yup.string(),
        imageName: yup.string(),
        liquidUnit: yup.string().required("A liquid measurement is required"),
      })
    ),
    defaultValues: {
      setupDate: new Date().toDateString(),
      liquidUnit: user?.liquidUnit,
    },
  });

  useEffect(() => {
    setValue("liquidUnit", user?.liquidUnit);
  }, [user]);

  const handleBrowsePhotos = async (key, media) => {
    if (media?.assets?.length) {
      const asset = media.assets[0];

      setValue("imageUri", asset.uri);
      setValue("imageName", asset.fileName);
      setValue("imageType", asset.type);
    }
  };
  const { CameraMediaModal } = useCameraOrMedia(handleBrowsePhotos);

  // Refs for text inputs

  const handleConfirmTank = async (data) => {
    const formData = new FormData();

    data?.imageUri &&
      formData.append("file", {
        uri: data?.imageUri,
        type: data?.imageType,
        name: data?.imageName,
      });

    formData.append("name", data.name);
    formData.append("setupDate", data.setupDate);
    formData.append("volume", data.volume);
    formData.append("liquidUnit", data.liquidUnit);

    const result = await createTank(formData);
    if (result.status === 200) {
      await handleMarkTankOnboarded();
      await navigate(NOTIFICATIONS_PATH);
    } else {
      console.log("Error creating tank");
    }
  };

  const [imageUri, setupDate, liquid] = watch([
    "imageUri",
    "setupDate",
    "liquidUnit",
  ]);

  return (
    <GuestScreenWrapper style={{ backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        bottomOffset={20}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Grid justifyContent="center" direction="column" gap={16}>
          <ProgressBar percentage={65} height={5} />

          <Heading variant={1} weight="semiBold">
            Your Tank
          </Heading>
          <Heading variant={5} weight="regular" style={{ marginTop: -24 }}>
            You can setup more later
          </Heading>

          <CameraMediaModal limit={1}>
            <Grid alignItems="center" gap={16}>
              <View style={styles.profileImageWrapper}>
                {imageUri ? (
                  <AppImage
                    path={imageUri}
                    localImage={true}
                    width={98}
                    height={98}
                    style={{ borderRadius: 100 }}
                  />
                ) : (
                  <Icon name="addUserMale" fill="black" />
                )}
              </View>
              <Heading variant={5} weight="regular">
                Upload Tank Picture
              </Heading>
            </Grid>
          </CameraMediaModal>

          <TextInput
            control={control}
            autoCapitalize="none"
            label="Tank Name"
            name="name"
            placeholder="Please enter a tank name"
            hasError={errors?.name?.message}
            maxLength={60}
          />

          <Select
            label="Unit of Measurement"
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

          <TextInput
            keyboardType="numeric"
            control={control}
            autoCapitalize="none"
            label="System Volume"
            name="volume"
            transformFn={(value) => value.replace(",", ".")}
          />
          <DateSelect
            label="Setup Date"
            onConfirm={(date) => setValue("setupDate", date)}
            value={setupDate}
          />
          <Button
            variant="secondary"
            title="Confirm Tank"
            onPress={handleSubmit(handleConfirmTank)}
            isLoading={isSubmitting || isLoading}
          />
        </Grid>
      </KeyboardAvoidingView>
    </GuestScreenWrapper>
  );
};

const styles = StyleSheet.create({
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: REEF_DOCS_GREY,
    backgroundColor: "#EEF2F4",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
