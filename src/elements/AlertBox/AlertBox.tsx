import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "../../components";

import { WHITE } from "../../constants";

type Props = {
  variant?: "success" | "error" | "warning";
  children?: any;
};

export const AlertBox: React.FC<Props> = ({
  children,
  variant = "success",
}) => {
  const variantStyle = styles[variant];

  return (
    <View style={[styles.base, variantStyle]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 16,
  },
  success: {
    backgroundColor: "green",
    borderRadius: 8,
  },
  error: {
    backgroundColor: "red",
    borderRadius: 8,
  },
  warning: {
    backgroundColor: "#fbc666",
    borderRadius: 8,
  },
  text: {
    color: WHITE,
  },
});
