import * as Device from "expo-device";

export const isEdgeToEdge = () => {
  const apiLevel = Device.platformApiLevel;

  return apiLevel >= 35;
};
