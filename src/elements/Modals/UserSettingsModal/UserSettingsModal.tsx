import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { getAppDimensions } from "../../../utility/dimensions";

import { useUser } from "../../../hooks/useAuth";

import { UserMenuSection } from "./UserMenuSection.tsx/UserMenuSection";
import { UserFeedBackSection } from "./UserFeedbackSection/UserFeedbackSection";
import { UserNotificationSection } from "./UserNotificationSection/UserNotificationSection";
import { UserMeasurementSection } from "./UserMeasurementSection/UserMeasurementSection";
import {
  AppImage,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
} from "../../../components";
import { LoggedInUserProfileImage } from "../../LoggedInUserProfileImage/LoggedInUserProfileImage";

import { UserAccountSection } from "./UserAccountSection/UserAccountSection";
import { UserSubscribeSection } from "./UserSubscribeSection/UserSubscribeSection";
import { UserRewardsSection } from "./UserRewardsSection/UserRewardsSection";

import { UserContactSection } from "./UserContactSection/UserContactSection";
import { UserDeleteRequestSection } from "./UserDeleteRequestSection/UserDeleteRequestSection";
import { UserServerSwitchSection } from "./UserServerSwitchSection/UserServerSwitchSection";
import { getAppEnv } from "../../../utility/environment";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  setContextSwitchLoading,
  setNotificationMenuActive,
  setNotifications,
  setSearchActive,
  setSearchResults,
} from "../../../store/slices/globalSlice";
import { useAudience } from "../../../hooks/useAudience";
import {
  selectStoreMode,
  setAudience,
  setStoreMode,
} from "../../../store/slices/userConfigSlice";
import { useNavigate } from "react-router-native";
import { UserUpdateHistorySection } from "./UserUpdateHistorySection/UserUpdateHistorySection";
import { getAppVersionInfo } from "../../../utility/getAppVersion";
import { setLastUsedQueryParams } from "../../../store/slices/liveStockSlice";
import { setLastUsedQueryParamsPlantCoral } from "../../../store/slices/coralPlantSlice";
import { AlertBox } from "../../AlertBox/AlertBox";
import { createAppDate } from "../../../utility/date";
import { clearAllPosts } from "../../../store/slices/postSlice";
import { UserLegalSection } from "./UserLegalSection/UserLegalSection";
import { UserDeveloperInformation } from "./UserDeveloperInformation/UserDeveloperInformation";

import OctoroSmall from "../../../../assets/octoro-full.png";
import { UserSocialSection } from "./UserSocialSection/UserSocialSection";

const SCREEN_WIDTH = getAppDimensions().width;

export const UserSettingsModal = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = React.useState(0);

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("");

  const handleOpenExternalLink = async () => {
    await Linking.openURL("https://octoro.co.uk");
  };

  const { audience } = useAudience();

  const user = useUser();

  const { buildNumber, version } = getAppVersionInfo();

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNextStep = (item) => {
    setActiveSection(item?.definition);

    translateX.value = withTiming(-(step + 1) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + 1);
  };

  const handleBack = () => {
    translateX.value = withTiming(-(step - 1) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step - 1);
  };

  const handleContextSwitch = async (context: "reef-docs" | "fresh-docs") => {
    await AsyncStorage.setItem("audience", context);
    dispatch(setAudience(context));
    dispatch(setContextSwitchLoading(true));
    navigate("/");
    dispatch(setLastUsedQueryParams(""));
    dispatch(setLastUsedQueryParamsPlantCoral(""));
    dispatch(setSearchResults({}));
    dispatch(setSearchActive(false));
    dispatch(setNotificationMenuActive(false));
    dispatch(clearAllPosts());
    dispatch(
      setNotifications({
        unreadCount: 0,
        notifications: {},
      })
    );
  };

  const shopMode = useAppSelector(selectStoreMode);

  const handleEnableShopMode = () => {
    dispatch(setStoreMode(!shopMode));
  };

  const menuItems = [
    {
      label: "General",
      spacer: true,
    },
    {
      label: "Account Information",
      icon: "reefDocsAccountInformation",
      definition: "account",
    },
    {
      label: "Social",
      icon: "reefDocsComment",
      definition: "social",
    },
    {
      label: "Subscription",
      icon: "reefDocsSubscribe",
      definition: "subscription",
    },
    {
      label: "Preferences",
      icon: "tank",
      spacer: true,
    },
    {
      label: "Units / Measurements",
      icon: "reefDocsMeasurements",
      definition: "measurements",
    },
    {
      label: "Notifications",
      icon: "reefDocsNotifications",
      definition: "notifications",
    },
    {
      label: "Region",
      icon: "reefDocsServerChange",
      definition: "server",
    },
    {
      label: "Other",
      spacer: true,
    },
    {
      label: "Feedback",
      icon: "reefDocsFeedback",
      definition: "feedback",
    },
    {
      label: "Contact Us",
      icon: "reefDocsContact",
      definition: "contact",
    },
    {
      label: "Legal",
      icon: "reefDocsLegal",
      definition: "legal",
    },
    {
      label: "Developer Information",
      icon: "reefDocsContact",
      definition: "developer",
    },
    {
      spacer: true,
      label: "Danger",
    },
    {
      label: "Delete Account",
      definition: "deleteAccount",
      icon: "reefDocsDeleteAccount",
    },
  ];

  return (
    <View>
      <Grid gap={8}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <Grid
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor: WHITE,
                borderBottomColor: INPUT_BORDER_COLOR,
                borderBottomWidth: 1,
              }}
            >
              <GridItem alignItems="center" style={{ padding: 16 }}>
                <LoggedInUserProfileImage disableOnPress={true} />
                <Heading variant={6} weight="semiBold">
                  {user?.displayName}
                </Heading>
                <Text style={styles.text}>{user?.userName}</Text>
              </GridItem>
              <Grid direction="row" gap={16} style={{ paddingRight: 16 }}>
                {user?.isStoreOwner && (
                  <TouchableOpacity onPress={handleEnableShopMode}>
                    <GridItem alignItems="center">
                      <View
                        style={{
                          borderRadius: 100,
                          borderWidth: 3,
                          borderColor: shopMode ? REEF_DOCS_BLUE : WHITE,
                          padding: 8,
                        }}
                      >
                        <Icon name="reefDocsShop" width={27} height={27} />
                      </View>

                      <Heading variant={6} weight="semiBold">
                        Shop Mode
                      </Heading>
                      <Text style={styles.text}></Text>
                    </GridItem>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleContextSwitch("reef-docs")}
                >
                  <GridItem alignItems="center">
                    <AppImage
                      path={
                        audience === "fresh-docs"
                          ? "/app/shutterstock_2453177503-bw.png"
                          : "/app/shutterstock_2453177503.jpg"
                      }
                      width={48}
                      height={48}
                      transform={true}
                      style={{
                        borderRadius: 100,
                        borderWidth: 3,
                        borderColor: audience === "reef-docs" ? BLACK : WHITE,
                      }}
                    />
                    <Heading variant={6} weight="semiBold">
                      Saltwater
                    </Heading>
                    <Text style={styles.text}></Text>
                  </GridItem>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleContextSwitch("fresh-docs")}
                >
                  <GridItem alignItems="center">
                    <AppImage
                      path={
                        audience === "reef-docs"
                          ? "/app/shutterstock_2080518181-bw.png"
                          : "/app/shutterstock_2080518181.jpg"
                      }
                      width={48}
                      height={48}
                      transform={true}
                      style={{
                        borderRadius: 100,
                        borderWidth: 3,
                        borderColor: audience === "fresh-docs" ? BLACK : WHITE,
                      }}
                    />
                    <Heading variant={6} weight="semiBold">
                      Freshwater
                    </Heading>
                    <Text style={styles.text}></Text>
                  </GridItem>
                </TouchableOpacity>
              </Grid>
            </Grid>
            {user?.postBan && (
              <View style={{ padding: 16 }}>
                <AlertBox variant="warning">
                  <Text style={{ fontSize: 12 }}>
                    Your account is currently restricted due to community rule
                    violations. Your restriction will be lifted{" "}
                    {createAppDate(user?.postBanExpires)}
                  </Text>
                </AlertBox>
              </View>
            )}

            {/* <UserReputationSection /> */}
            <FlatList
              data={
                getAppEnv() === "production"
                  ? menuItems?.filter((i) => i.definition !== "subscription")
                  : menuItems
              }
              renderItem={({ item }) => (
                <UserMenuSection
                  icon={item.icon}
                  label={item.label}
                  spacer={item.spacer}
                  handleNextStep={() => handleNextStep(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
              ListFooterComponent={() => (
                <View>
                  <Text
                    style={{ fontSize: 12, textAlign: "center", marginTop: 16 }}
                    weight="bold"
                  >
                    Version: {version}
                    {buildNumber ? ` Build: ${buildNumber}` : ""}
                  </Text>
                  <TouchableOpacity
                    onPress={handleOpenExternalLink}
                    style={{ alignItems: "center", marginTop: 8 }}
                  >
                    <Image
                      source={OctoroSmall}
                      style={{
                        height: 30,
                        aspectRatio: 2.9644,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.stepContainer}>
            <TouchableOpacity
              onPress={() => handleBack()}
              style={[styles.menuWrapper, { marginBottom: 16 }]}
            >
              <Grid direction="row" gap={8}>
                <Icon name="chevronLeft" fill={BLACK} />
                <GridItem flex={1} justifyContent="center">
                  <Text>Back</Text>
                </GridItem>
              </Grid>
            </TouchableOpacity>
            {renderSection(activeSection)}
          </View>
        </Animated.View>
      </Grid>
    </View>
  );
};

const renderSection = (definition) => {
  const registry = {
    feedback: UserFeedBackSection,
    notifications: UserNotificationSection,
    measurements: UserMeasurementSection,
    account: UserAccountSection,
    subscription: UserSubscribeSection,
    rewards: UserRewardsSection,
    contact: UserContactSection,
    deleteAccount: UserDeleteRequestSection,
    server: UserServerSwitchSection,
    updateHistory: UserUpdateHistorySection,
    legal: UserLegalSection,
    developer: UserDeveloperInformation,
    social: UserSocialSection,
  };

  const Component = registry[definition];

  if (!Component) return <Text>{definition} not in registry</Text>;

  return <Component />;
};

const styles = StyleSheet.create({
  text: {
    color: REEF_DOCS_GREY,
    fontSize: 12,
  },
  cardWrapper: {
    alignItems: "center",
  },
  menuHeading: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    marginLeft: -16,
    marginRight: -16,
    padding: 16,
  },
  menuButton: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 2, // Total width for 4 steps
    height: "100%",
  },
  menuWrapper: {
    padding: 8,
    borderBottomWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    borderBottomColor: INPUT_BORDER_COLOR,
    backgroundColor: WHITE,
  },
});
