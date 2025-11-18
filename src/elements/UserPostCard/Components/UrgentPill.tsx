import React from "react";
import { StyleSheet } from "react-native";

import { Pill } from "../../../components/Pill/Pill";
import { Text } from "../../../components";

export const UrgentPill = () => {
  return (
    <Pill style={styles.pill} backgroundColor="red">
      <Text style={styles.text}>Urgent</Text>
    </Pill>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 4,
    paddingVertical: 6,
    borderColor: "red",
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});
