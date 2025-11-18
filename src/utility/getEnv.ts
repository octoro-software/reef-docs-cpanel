import Constants from "expo-constants";

export const getEnv = (): "development" | "staging" | "production" => {
  const env = Constants.expoConfig.extra.APP_ENV;

  return env;
};
