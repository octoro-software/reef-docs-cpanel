import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  Select,
  Text,
  TextInput,
} from "../../../../components";

import {
  useGetTimeZones,
  useLogout,
  usePartialProfileUpdate,
  useUser,
} from "../../../../hooks/useAuth";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { AppImage } from "../../../../components/AppImage/AppImage";
import { useAppDispatch } from "../../../../hooks/useRedux";
import { setUserProfile } from "../../../../store/slices/globalSlice";
import { useCameraOrMedia } from "../../../../utility/camera";

export const UserAccountSection = () => {
  const dispatch = useAppDispatch();

  const [getTimeZones] = useGetTimeZones();

  const [timezones, setTimezones] = useState([]);

  const handleGetTimeZones = async () => {
    const result = await getTimeZones();

    setTimezones(result?.data);
  };

  useEffect(() => {
    handleGetTimeZones();
  }, []);

  const user = useUser();

  const [handleLogout, logoutLoading, logoutError] = useLogout();

  const [handlePartialProfileUpdate, partialSubmitLoading] =
    usePartialProfileUpdate();

  const [success, setSuccess] = useState(false);

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      imageUri: "",
      imageType: "",
      imageName: "",
      timezone: user?.timezone || "",
    },
    resolver: yupResolver(
      yup.object().shape({
        displayName: yup
          .string()
          .required("A display name is required")
          .max(60),
        email: yup.string().required("An email is required"),
        image: yup.string().nullable(),
        imageUri: yup.string(),
        imageType: yup.string(),
        imageName: yup.string(),
        timezone: yup.string().required("Timezone is required"),
      })
    ),
  });

  useEffect(() => {
    reset(user);
  }, []);

  const handleBrowsePhotos = async (key, media) => {
    if (media?.assets?.length) {
      const asset = media.assets[0];

      setValue("imageUri", asset.uri);
      setValue("imageName", asset.fileName);
      setValue("imageType", asset.type);
    }
  };

  const { CameraMediaModal } = useCameraOrMedia(handleBrowsePhotos);

  const handleSubmit = async () => {
    const valid = await trigger();

    if (valid) {
      const data = getValues();

      const formData = new FormData();

      data?.imageUri &&
        formData.append("file", {
          uri: data.imageUri,
          type: data.imageType,
          name: data.imageName,
        });

      formData.append("displayName", data.displayName);
      formData.append("timezone", data.timezone);

      const response = await handlePartialProfileUpdate(formData);

      if (response?.status === 200) {
        setSuccess(true);

        const responseData = response?.data?.data;

        dispatch(setUserProfile(responseData));

        reset(responseData);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }
  };

  const [imageUri, image, timezone] = watch(["imageUri", "image", "timezone"]);

  const hasPreviousImage = user?.image;

  const hasUploaded = imageUri;

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            onPress={handleSubmit}
            title={success ? "Account Updated !" : "Save Changes"}
            variant={success ? "success" : "primary"}
            isLoading={partialSubmitLoading}
            disabled={success || partialSubmitLoading}
          />

          <Button
            onPress={handleLogout}
            title={"Logout"}
            isLoading={logoutLoading}
            error={logoutError}
          />
        </Grid>
      )}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <GridItem>
            <CameraMediaModal limit={1}>
              <Grid alignItems="center" gap={16}>
                <View style={styles.profileImageWrapper}>
                  {imageUri || image ? (
                    <View>
                      <AppImage
                        path={imageUri || image}
                        localImage={Boolean(imageUri)}
                        width={98}
                        height={98}
                        style={{ borderRadius: 100 }}
                      />
                      {hasPreviousImage && !hasUploaded && (
                        <View style={styles.editIcon}>
                          <Icon name="edit" fill={REEF_DOCS_BLUE} />
                        </View>
                      )}
                    </View>
                  ) : (
                    <Icon name="addUserMale" fill="black" />
                  )}
                </View>
                <Heading variant={5} weight="regular">
                  Account Information
                </Heading>
              </Grid>
            </CameraMediaModal>
            <Text style={styles.subText}>
              Update your account information here.
            </Text>
          </GridItem>

          <GridItem>
            <TextInput
              control={control}
              name="displayName"
              label="Display Name"
              hasError={errors.displayName?.message}
            />
          </GridItem>

          <GridItem>
            <TextInput
              control={control}
              name="email"
              label="Email Address"
              keyboardType="email-address"
              hasError={errors.displayName?.message}
              editable={false}
              disabled
            />
          </GridItem>
          <GridItem>
            <Select
              label="Timezone"
              title="Timezone"
              grouped
              options={timezones}
              labelKey="name"
              valueKey="name"
              onConfirm={(value) => setValue("timezone", value)}
              value={timezone}
            />
          </GridItem>
          {/* 
          <GridItem>
            <Button title="Change Email Address" variant="secondary" />
          </GridItem>

          <GridItem>
            <Button title="Change Password" variant="secondary" />
          </GridItem> */}
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
  editIcon: {
    position: "absolute",
    right: -10,
    bottom: 0,
  },
});
