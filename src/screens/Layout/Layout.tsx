import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useLocation } from "react-router-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScreenWrapper } from "../../components";

import {
  APP_HEADER_HEIGHT,
  CORAL_HELP_PATH,
  DISEASE_HELP_PATH,
  FRIEND_OR_FOE_PATH,
  SOCIAL_PATH,
  LIVESTOCK_PATH,
  MORE_PATH,
  POLLS_PATH,
  SCREEN_BACKGROUND_COLOR,
  TANK_FISH_PATH,
  TANK_INVERTS_PATH,
  TESTING_PATH,
  SOCIAL_MY_POSTS_PATH,
  SOCIAL_SAVED_POSTS_PATH,
  SOCIAL_PENDING_POSTS_PATH,
  SOCIAL_URGENT_PATH,
  TANK_PROGRESS_PATH,
  TANK_AMPHIBIANS_PATH,
  TANK_REPTILES_PATH,
  BASKET_PATH,
} from "../../constants";

import { useAppSelector } from "../../hooks/useRedux";
import {
  selectSocialFullScreen,
  selectStoreSignup,
} from "../../store/slices/globalSlice";
import { useModal } from "../../hooks/useModal";
import { UserPostMediaBackgroundUploadLoader } from "../../elements/UserPostMediaBackgroundUploadLoader/UserPostMediaBackgroundUploadLoader";
import { SocialFullScreen } from "../Social/SocialFullScreen/SocialFullScreen";

export const socialPaths = [
  SOCIAL_PATH,
  SOCIAL_MY_POSTS_PATH,
  SOCIAL_SAVED_POSTS_PATH,
  SOCIAL_URGENT_PATH,
  SOCIAL_PENDING_POSTS_PATH,
];

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();

  const { openModal } = useModal();

  const storeSignupFlow = useAppSelector(selectStoreSignup);

  const scrollViewDisabled = [
    DISEASE_HELP_PATH,
    FRIEND_OR_FOE_PATH,
    SOCIAL_MY_POSTS_PATH,
    SOCIAL_SAVED_POSTS_PATH,
    SOCIAL_URGENT_PATH,
    SOCIAL_PENDING_POSTS_PATH,
    SOCIAL_PATH,
    CORAL_HELP_PATH,
    POLLS_PATH,
    TANK_FISH_PATH,
    LIVESTOCK_PATH,
    TANK_INVERTS_PATH,
    MORE_PATH,
    TESTING_PATH,
    TANK_PROGRESS_PATH,
    TANK_AMPHIBIANS_PATH,
    TANK_REPTILES_PATH,
  ].includes(location.pathname);

  const screenPadding = socialPaths.includes(location.pathname) ? 0 : 16;

  const socialFullScreen = useAppSelector(selectSocialFullScreen);

  useEffect(() => {
    if (storeSignupFlow?.shouldInit) {
      openModal({
        type: "storeSignupModal",
        modalTitle: "Join Store",
        height: "large",
        data: storeSignupFlow,
      });
    }
  }, [storeSignupFlow]);

  return (
    <SafeAreaView>
      {socialFullScreen?.active && <SocialFullScreen />}
      <View style={{ height: "100%" }}>
        <Header />
        <View
          style={{
            position: "absolute",
            top: APP_HEADER_HEIGHT,
            zIndex: 9999,
            width: "100%",
          }}
        >
          <UserPostMediaBackgroundUploadLoader />
        </View>
        <ScreenWrapper
          key={location.pathname}
          scrollEnabled={!scrollViewDisabled}
          style={styles.screen}
          screenPadding={screenPadding}
        >
          {children}
        </ScreenWrapper>
      </View>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
});
