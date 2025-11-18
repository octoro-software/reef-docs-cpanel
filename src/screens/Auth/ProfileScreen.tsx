import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useGetUserProfile,
  usePartialProfileUpdate,
  useUserNameUniqueCheck,
} from "../../hooks/useAuth";

import {
  Button,
  Grid,
  Heading,
  ScreenWrapper,
  TextInput,
  ProgressBar,
  Icon,
  RichText,
  GridItem,
  Text,
} from "../../components";

import {
  AUDIENCE_PATH,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../constants";
import { AppImage } from "../../components/AppImage/AppImage";
import { useCameraOrMedia } from "../../utility/camera";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useAudience } from "../../hooks/useAudience";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "../../hooks/useRedux";
import { setAudience } from "../../store/slices/userConfigSlice";
import { registerForPushNotificationsAsync } from "../../hooks/usePushNotifications";
import { OnboardingContext } from "../../providers/OnboardingProvider";

export const ProfileScreen: React.FC = () => {
  const [handleUserNameUniqueCheck] = useUserNameUniqueCheck();

  const [handlePartialProfileUpdate, partialUpdateLoading, partialUpdateError] =
    usePartialProfileUpdate();

  const { setIsOnBoarding } = useContext(OnboardingContext);

  const dispatch = useAppDispatch();

  const [uniqueCheckStatus, setUniqueCheckStatus] = useState("pending");

  const navigate = useNavigate();

  const { audience } = useAudience();

  const handleContextSwitch = async (context: "reef-docs" | "fresh-docs") => {
    await AsyncStorage.setItem("audience", context);
    dispatch(setAudience(context));
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        displayName: yup
          .string()
          .required("A Display Name is Required")
          .max(20, "Must be 20 characters or less"),
        userName: yup
          .string()
          .required("A User Name is Required")
          .min(4, "User Name must be at least 4 characters")
          .max(20)
          .matches(/^[a-zA-Z0-9_]*$/, {
            message: "User Name must be alphanumeric",
          }),
        imageUri: yup.string(),
        imageType: yup.string(),
        imageName: yup.string(),
      })
    ),
  });

  const handleUserNameCheck = async (value) => {
    if (value && value?.length > 4) {
      setUniqueCheckStatus("loading");

      try {
        const uniqueCheck = await handleUserNameUniqueCheck({
          userName: value,
        });
        if (uniqueCheck?.status === 200) {
          setUniqueCheckStatus("success");
        } else {
          setUniqueCheckStatus("error");
          console.log("set error");
        }
      } catch (error) {
        setUniqueCheckStatus("error");
      }
    }
  };

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

  const [getUserProfile] = useGetUserProfile();

  const handleRegisterNotifications = async () => {
    await registerForPushNotificationsAsync(
      {
        marketing: true,
        tasks: true,
        reminders: true,
        posts: true,
        system: true,
      },
      true
    );

    await getUserProfile();
  };

  const handleConfirmBasicProfile = async (data) => {
    const formData = new FormData();

    data?.imageUri &&
      formData.append("file", {
        uri: data.imageUri,
        type: data.imageType,
        name: data.imageName,
      });

    formData.append("userName", data.userName);
    formData.append("displayName", data.displayName);

    await handlePartialProfileUpdate(formData);

    await handleRegisterNotifications();

    setIsOnBoarding(false);
  };

  const [currentUserName, imageUri] = watch(["userName", "imageUri"]);

  return (
    <ScreenWrapper style={{ backgroundColor: "#fff", paddingTop: 48 }}>
      <KeyboardAvoidingView
        bottomOffset={20}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Grid justifyContent="center" direction="column" gap={16}>
          <ProgressBar percentage={99} height={5} />

          <Heading variant={1} weight="semiBold">
            Social Profile
          </Heading>

          <CameraMediaModal limit={1}>
            <Grid alignItems="center" gap={16}>
              <View style={styles.profileImageWrapper}>
                {imageUri ? (
                  <AppImage
                    path={imageUri}
                    localImage={Boolean(imageUri)}
                    width={98}
                    height={98}
                    style={{ borderRadius: 100 }}
                  />
                ) : (
                  <Icon name="addUserMale" fill="black" />
                )}
              </View>
              <Heading variant={5} weight="regular">
                Upload Profile Picture
              </Heading>
            </Grid>
          </CameraMediaModal>

          <TextInput
            control={control}
            autoCapitalize="none"
            label="User Name"
            name="userName"
            keyboardType="default"
            placeholder="Please enter a user name"
            transformFn={(value) => value.replace(/[^a-zA-Z0-9_]/g, "")}
            maxLength={20}
            textContentType="username"
            autoComplete="username"
            hasError={
              errors?.displayName?.message || uniqueCheckStatus === "error"
            }
            onBlur={handleUserNameCheck}
            onFocus={() => setUniqueCheckStatus("pending")}
            rightComponentRender={() => {
              return (
                <View style={{ position: "absolute", right: 8, top: 30 }}>
                  {uniqueCheckStatus === "loading" && (
                    <View style={{ marginTop: 6, marginRight: 8 }}>
                      <ActivityIndicator color={REEF_DOCS_BLUE} />
                    </View>
                  )}
                  {uniqueCheckStatus === "success" && (
                    <View style={{ marginTop: 2, marginRight: 4 }}>
                      <Icon name="check" fill="green" width={32} height={32} />
                    </View>
                  )}
                  {uniqueCheckStatus === "error" && (
                    <View style={{ marginTop: 2, marginRight: 4 }}>
                      <Icon name="close" fill="red" width={32} height={32} />
                    </View>
                  )}
                </View>
              );
            }}
          />
          {uniqueCheckStatus === "error" ? (
            <RichText
              styles={{
                p: {
                  fontSize: 12,
                  fontWeight: "600",
                  margin: 0,
                },
                span: {
                  color: "red",
                },
              }}
              html={`<p>The username <span>${currentUserName}</span> is already in use. Please choose another`}
            />
          ) : (
            <Heading variant={6} weight="regular" style={{ marginTop: -8 }}>
              Unique, Min 4, Max 20, no spaces or special characters, strictly
              no vendor names.
            </Heading>
          )}

          <TextInput
            control={control}
            autoCapitalize="none"
            label="Display Name"
            name="displayName"
            placeholder="Please enter your name"
            hasError={errors?.displayName?.message}
            maxLength={20}
          />

          <Heading variant={6} weight="regular" style={{ marginTop: -8 }}>
            Strictly no vendor names.
          </Heading>

          <Text weight="semiBold">Fresh or Salt ?</Text>
          <Text weight="regular" style={{ marginTop: -10 }}>
            You can freely switch between these at any time within the app from
            the account menu. This is just to get you started.
          </Text>

          <Grid direction="row" gap={16}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => handleContextSwitch("reef-docs")}
            >
              <GridItem flex={1}>
                <AppImage
                  transform={true}
                  path={
                    audience === "fresh-docs"
                      ? "/app/shutterstock_2453177503-bw.png"
                      : "/app/shutterstock_2453177503.jpg"
                  }
                  width={"100%"}
                  height={100}
                  style={{
                    borderWidth: 4,
                    borderColor:
                      audience === "reef-docs" ? REEF_DOCS_BLUE : WHITE,
                  }}
                />
                <Heading variant={6} weight="semiBold">
                  Saltwater
                </Heading>
              </GridItem>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => handleContextSwitch("fresh-docs")}
            >
              <GridItem alignItems="center">
                <AppImage
                  path={
                    audience === "reef-docs"
                      ? "/app/shutterstock_2080518181-bw.png"
                      : "/app/shutterstock_2080518181.jpg"
                  }
                  width={"100%"}
                  transform={true}
                  height={100}
                  style={{
                    borderWidth: 4,
                    borderColor:
                      audience === "fresh-docs" ? REEF_DOCS_BLUE : WHITE,
                  }}
                />
                <Heading variant={6} weight="semiBold">
                  Freshwater
                </Heading>
              </GridItem>
            </TouchableOpacity>
          </Grid>

          <Button
            variant="secondary"
            title="Enter Aqua Docs"
            onPress={handleSubmit(handleConfirmBasicProfile)}
            isLoading={partialUpdateLoading}
            error={partialUpdateError}
          />
        </Grid>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
