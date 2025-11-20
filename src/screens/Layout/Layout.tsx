import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocation } from "react-router-native";

import { ScreenWrapper } from "../../components";

import { SCREEN_BACKGROUND_COLOR } from "../../constants";
import LinearGradient from "react-native-linear-gradient";

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
        <LinearGradient
          colors={["#020617", "#020720", "#000814"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bgGradient}
        >
          {children}
        </LinearGradient>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
  bgGradient: {
    flex: 1,
    position: "relative",
  },
});
