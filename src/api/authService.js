import * as SecureStore from "expo-secure-store"; // Use AsyncStorage if needed

let inMemoryAccessToken = null;

export const setAccessToken = async (token) => {
  inMemoryAccessToken = token;
  if (token) {
    await SecureStore.setItemAsync("accessToken", token);
  } else {
    await SecureStore.deleteItemAsync("accessToken");
  }
};

export const getAccessToken = async () => {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }
  const token = await SecureStore.getItemAsync("accessToken");
  inMemoryAccessToken = token;
  return token;
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

export const setRefreshToken = async (token) => {
  if (token) {
    await SecureStore.setItemAsync("refreshToken", token);
  } else {
    await SecureStore.deleteItemAsync("refreshToken");
  }
};
