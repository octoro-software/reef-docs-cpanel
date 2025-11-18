import Constants from "expo-constants";

export const getAppEnv = (): "development" | "staging" | "production" => {
  return Constants.expoConfig.extra.APP_ENV;
};
