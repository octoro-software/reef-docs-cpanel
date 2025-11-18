import React from "react";
import LottieView from "lottie-react-native";

export const LoadingSpinner = ({ width = 48 }) => {
  return (
    <LottieView
      source={require("../../lottie-loader.json")}
      autoPlay
      loop
      style={{ width, height: width }}
    />
  );
};
