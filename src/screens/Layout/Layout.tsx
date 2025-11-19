import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocation } from "react-router-native";

import { ScreenWrapper } from "../../components";

import { SCREEN_BACKGROUND_COLOR } from "../../constants";

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <View style={{ height: "100%" }}>
      <ScreenWrapper
        key={location.pathname}
        scrollEnabled={false}
        style={styles.screen}
        screenPadding={0}
      >
        {children}
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
});
