import React from "react";
import { StyleSheet } from "react-native";

import { Heading } from "../../Heading/Heading";

import { REEF_DOCS_GREY } from "../../../constants";

export const InputLabel: React.FC<{ children: any }> = ({ children }) => {
  return (
    <Heading style={styles.root} variant={6} weight="regular">
      {children}
    </Heading>
  );
};

const styles = StyleSheet.create({
  root: {
    color: REEF_DOCS_GREY,
    margin: 0,
    padding: 0,
  },
});
