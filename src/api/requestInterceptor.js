import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@react-native-firebase/app-check";
import { getApp } from "@react-native-firebase/app";
import appCheck from "@react-native-firebase/app-check";

import { getAccessToken } from "./authService";
import { API_BASE_URL, API_BASE_URL_US } from "../constants";
import { Platform } from "react-native";

export const attachAuthToken = async (config) => {
  const token = await getAccessToken();

  const audience = (await AsyncStorage.getItem("audience")) ?? "reef-docs";

  const { token: appCheckToken } = Platform.OS === 'ios' && __DEV__ ? {token: ''}:  await getToken(appCheck(getApp()));

  const usServerUrl = await getBaseUrl();

  config.baseURL = usServerUrl;

  config.headers["X-Firebase-AppCheck"] = appCheckToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.audience = audience;

  return config;
};

export const getBaseUrl = async () => {
  const usServer = await AsyncStorage.getItem("usServer");

  return usServer === "true" ? API_BASE_URL_US : API_BASE_URL;
};
