import React from "react";
import { NativeRouter, DeepLinking, useDeepLinking } from "react-router-native";

export const NavigationProvider = ({ children }) => {
  return <NativeRouter>{children}</NativeRouter>;
};
