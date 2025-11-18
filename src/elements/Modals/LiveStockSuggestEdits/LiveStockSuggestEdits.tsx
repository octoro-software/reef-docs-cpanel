import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { getAppDimensions } from "../../../utility/dimensions";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../constants";
import { SuggestEditForm } from "./Parts/SuggestEditForm";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockSuggestEdits = ({ id }) => {
  return (
    <Animated.View style={[styles.animatedContainer]}>
      <View style={styles.stepContainer}>
        <SuggestEditForm id={id} />
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 0,
  },
  paragraph: {
    marginBottom: 16,
    textAlign: "center",
  },
  oldPrice: {
    marginVertical: 16,
    textAlign: "center",
    textDecorationLine: "line-through",
    color: "#999",
  },
  discountLabel: {
    textAlign: "center",
    fontWeight: "bold",
    color: REEF_DOCS_BLUE,
    marginBottom: 4,
    fontSize: 16,
  },
  newPrice: {
    marginVertical: 8,
    textAlign: "center",
    color: REEF_DOCS_BLUE,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    padding: 16,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 5, // Total width for 4 steps
    height: "100%",
  },
  sectionHeading: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});
