import React from "react";
import { StyleSheet } from "react-native";
import { Heading } from "../../Heading/Heading";

// Accept broader error types, and extract the message if necessary
export const ErrorText: React.FC<{
  text?: string | { message?: string } | null;
}> = ({ text }) => {
  const errorMessage = typeof text === "string" ? text : text?.message;

  if (!errorMessage) return null;

  return (
    <Heading style={styles.errorText} variant={6} weight="regular">
      {errorMessage}
    </Heading>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
  },
});
