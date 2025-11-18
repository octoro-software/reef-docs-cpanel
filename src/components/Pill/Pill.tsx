import React from "react";
import { StyleSheet, View } from "react-native";

import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../constants";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: object;
};

export const Pill: React.FC<Props> = ({
  children,
  backgroundColor = REEF_DOCS_BLUE,
  style,
}) => {
  return (
    <View style={[styles.wrapper, { backgroundColor }, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
});
