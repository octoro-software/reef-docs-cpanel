import * as Application from "expo-application";

export const getAppVersionInfo = () => {
  const version = Application.nativeApplicationVersion;
  const buildNumber = Application.nativeBuildVersion;

  return { version, buildNumber };
};
