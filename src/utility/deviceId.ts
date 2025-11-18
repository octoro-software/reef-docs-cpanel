import * as Application from "expo-application";

import { Platform } from "react-native";

export async function getDeviceId() {
  if (Platform.OS === "ios") {
    // Identifier for Vendor (IDFV)
    const idfv = await Application.getIosIdForVendorAsync();
    return idfv;
  } else if (Platform.OS === "android") {
    // ANDROID_ID
    return Application.getAndroidId();
  } else {
    return null;
  }
}
