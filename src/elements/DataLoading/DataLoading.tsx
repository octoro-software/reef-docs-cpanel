import React from "react";
import {  StyleSheet, View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";
import { Logo } from "../../components/Logo/Logo";
import { LoadingSpinner } from "../../components";

const height = getAppDimensions().height;

export const DataLoading: React.FC = () => {
  return (
      <View style={styles.container}>
        <Logo />
        <View style={{ marginTop: -80, marginBottom: 16 }}>
          <LoadingSpinner width={200} he />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height,
  },
});
