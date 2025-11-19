// apiClient.ts
import axios from "axios";
import { Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import appCheck from "@react-native-firebase/app-check";

import { API_BASE_URL } from "../constants";
import {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "./authService";
import { eventBus } from "../providers/eventBus";
import { logError } from "./errorHandler";

// Main client (has interceptors elsewhere)
export const api = axios.create({
  baseURL: API_BASE_URL,
  // Consider a sane timeout to surface offline quickly:
  timeout: 15000,
});

// A dedicated client that WILL NOT have response interceptors, used only for refresh
const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

async function getAppCheckHeader() {
  if (Platform.OS === "ios" && __DEV__) return "";
  try {
    // const { token } = await getAppCheckToken(appCheck(getApp()));
    // return token || "";
  } catch (e) {
    // Don’t block refresh just because App Check couldn’t fetch in dev
    return "";
  }
}

async function doRefresh() {
  const refreshToken = await getRefreshToken();
  const accessToken = await getAccessToken();

  if (!refreshToken || !accessToken) {
    throw new Error("Missing tokens before refresh");
  }

  // const appCheckToken = await getAppCheckHeader();

  const res = await authClient.post(
    "/auth/refreshToken",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        // "X-Firebase-AppCheck": appCheckToken,
      },
    }
  );

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    res?.data?.data?.token || {};

  if (!newAccessToken || !newRefreshToken) {
    throw new Error("Refresh response missing tokens");
  }

  await setAccessToken(newAccessToken);
  await setRefreshToken(newRefreshToken);
  return newAccessToken;
}

// Response error handler (use this in your interceptor)
export const handleResponseError = async (error) => {
  logError(error);

  const originalRequest = error.config || {};
  const status = error?.response?.status;

  // If it's a refresh call itself, don't try to refresh again
  if (originalRequest._isRefresh) {
    // If refresh itself failed due to unauthorized, force logout. Otherwise bubble up.
    if (status === 401) {
      try {
        eventBus.emit("forceLogout");
      } catch {}
    }
    return Promise.reject(error);
  }

  // Only attempt refresh on a 401 from a normal call, and only once
  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const newAccessToken = await doRefresh();
      // Retry the original request with the new token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      // Differentiate between “network error” and an actual auth failure

      const isAxiosNetworkError =
        refreshError?.message?.toLowerCase?.() === "network error" ||
        (!refreshError?.response && refreshError?.request);

      // Send the real error to Sentry (don’t JSON.stringify AxiosError — it loses context)
      Sentry.captureException(refreshError, {
        extra: {
          phase: "token_refresh",
          url: `${API_BASE_URL}/auth/refreshToken`,
        },
      });

      if (isAxiosNetworkError) {
        // Don’t log the user out just because they’re offline or the API is unreachable.
        // Bubble up so UI can show “You’re offline / server unreachable”.
        return Promise.reject(refreshError);
      }

      // For real 401/400 refresh failures, force logout.
      try {
        eventBus.emit("forceLogout");
      } catch {}
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};
