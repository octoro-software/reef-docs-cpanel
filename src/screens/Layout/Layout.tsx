import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useLocation } from "react-router-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenWrapper } from "../../components";

import { SCREEN_BACKGROUND_COLOR } from "../../constants";

import { useAppSelector } from "../../hooks/useRedux";
import {
  selectSocialFullScreen,
  selectStoreSignup,
} from "../../store/slices/globalSlice";
import { useModal } from "../../hooks/useModal";

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();

  const { openModal } = useModal();

  const storeSignupFlow = useAppSelector(selectStoreSignup);

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
      <View style={{ height: "100%" }}>
        <ScreenWrapper
          key={location.pathname}
          scrollEnabled={true}
          style={styles.screen}
          screenPadding={16}
        >
          {children}
        </ScreenWrapper>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
});
