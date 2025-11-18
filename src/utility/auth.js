import AsyncStorage from "@react-native-async-storage/async-storage";

export const hasPreviouslyLoggedIn = async () =>
  await AsyncStorage.getItem("hasLoggedInPreviously");
