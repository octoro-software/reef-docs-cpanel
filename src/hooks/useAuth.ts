import React, { useContext } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getApp } from "@react-native-firebase/app";
import appCheck from "@react-native-firebase/app-check";
import { getToken } from "@react-native-firebase/app-check";
import { useNavigate } from "react-router-native";
import * as Sentry from "@sentry/react-native";

import { AuthenticationContext } from "../providers/AuthenticationProvider";
import apiClient from "../api/apiClient";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  clearUser,
  selectUser,
  setUserProfile,
} from "../store/slices/globalSlice";

import {
  API_BASE_URL,
  API_LOGIN_API,
  API_LOGOUT_API,
  API_PASSWORD_RESET,
  API_PHONE_SEND_CODE,
  API_PHONE_VERIFY_CODE,
  API_PROFILE_URL,
  API_REGISTER_URL,
  API_SET_NEW_PASSWORD,
  API_TANK_ONBOARDED,
  API_USER_DELETE_REQUEST,
  API_USERNAME_CHECK,
  API_VERIFY_EMAIL,
  API_VERIFY_PASSWORD_RESET,
} from "../constants";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../constants/global";
import { setStoreMode } from "../store/slices/userConfigSlice";
import { Platform } from "react-native";
import { getDeviceId } from "../utility/deviceId";

export const useRequestVerificationCode = () => {
  const dispatch = useAppDispatch();

  const user = useUser();

  const fn = async (phone: string) => {
    const response = await apiClient.post(API_PHONE_SEND_CODE, {
      phone,
    });

    if (response?.status === 200) {
      dispatch(
        setUserProfile({
          ...user,
          phone,
          phoneVerified: false,
        })
      );
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useConfirmVerificationCode = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const fn = async (phone: string, code: string) => {
    const response = await apiClient.post(API_PHONE_VERIFY_CODE, {
      phone,
      code,
    });

    if (response?.status === 200) {
      dispatch(
        setUserProfile({
          ...user,
          phoneVerified: true,
        })
      );
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useUserDeleteAccountRequest = () => {
  const fn = async (data) => {
    const response = await apiClient.post(API_USER_DELETE_REQUEST, data);

    return response;
  };

  return useApiRequest(fn);
};

export const useRegisterUser = () => {
  const [getUserProfile] = useGetUserProfile();
  const { setAuthed } = useContext(AuthenticationContext);

  const handleRegister = async (data) => {
    const deviceId = await getDeviceId();

    const { token: appCheckToken } =
      Platform.OS === "ios" && __DEV__
        ? { token: "" }
        : await getToken(appCheck(getApp()));

    data.deviceId = deviceId;

    const response = await axios
      .post(`${API_BASE_URL}/${API_REGISTER_URL}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Firebase-AppCheck": appCheckToken,
        },
      })
      .catch((error) => error);

    if (response?.data?.data?.token) {
      await SecureStore.setItemAsync(
        ACCESS_TOKEN_STORAGE_KEY,
        response.data.data.token.accessToken
      );
      await SecureStore.setItemAsync(
        REFRESH_TOKEN_STORAGE_KEY,
        response.data.data.token.refreshToken
      );

      await getUserProfile();

      setAuthed(true);
    }

    return response;
  };

  return useApiRequest(handleRegister);
};

export const useVerifyEmail = () => {
  const handleVerifyEmail = async (data) => {
    const response = await apiClient
      .post(API_VERIFY_EMAIL, data)
      .catch((error) => error);

    return response;
  };

  return useApiRequest(handleVerifyEmail);
};

export const useRequestEmailVerificationCode = () => {
  const handleRequestVerificationCode = async () => {
    const response = await apiClient
      .get(API_VERIFY_EMAIL)
      .catch((error) => error);

    return response;
  };

  return useApiRequest(handleRequestVerificationCode);
};

export const useUserNameUniqueCheck = () => {
  const handleUserNameUniqueCheck = async (data) => {
    const response = await apiClient.post(API_USERNAME_CHECK, data);

    return response;
  };

  return useApiRequest(handleUserNameUniqueCheck);
};

export const usePartialProfileUpdate = () => {
  const handlePartialProfileUpdate = async (data) => {
    const response = await apiClient.post(API_PROFILE_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };

  return useApiRequest(handlePartialProfileUpdate);
};

export const useMarkTankOnBoarded = () => {
  const handleMarkTankOnboarded = async () => {
    const response = await apiClient.post(API_TANK_ONBOARDED, {});

    return response;
  };

  return useApiRequest(handleMarkTankOnboarded);
};

export const usePasswordReset = () => {
  const handlePasswordReset = async (data) => {
    const response = await apiClient.post(API_PASSWORD_RESET, data);

    return response;
  };

  return useApiRequest(handlePasswordReset);
};

export const useVerifyPasswordResetToken = () => {
  const handleVerifyPasswordResetToken = async (data) => {
    const response = await apiClient.post(API_VERIFY_PASSWORD_RESET, data);

    return response;
  };

  return useApiRequest(handleVerifyPasswordResetToken);
};

export const useUpdatePassword = () => {
  const handleUpdatePassword = async (data) => {
    const response = await apiClient.post(API_SET_NEW_PASSWORD, data);

    return response;
  };

  return useApiRequest(handleUpdatePassword);
};

export const useGetUserProfile = () => {
  const dispatch = useAppDispatch();

  const handleGetUserProfile = async () => {
    const response = await apiClient.get(API_PROFILE_URL);

    if (!response?.data?.data?.isStoreOwner) {
      dispatch(setStoreMode(false));
    }

    dispatch(setUserProfile(response?.data?.data));

    return response;
  };

  return useApiRequest(handleGetUserProfile);
};

export const useLogout = () => {
  const context = useContext(AuthenticationContext);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.post(API_LOGOUT_API);

    dispatch(clearUser(false));

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_STORAGE_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_STORAGE_KEY);

    Sentry.setUser(null);

    try {
      context?.setAuthed(false);
    } catch (error) {}

    navigate("/");
  };

  return useApiRequest(handleLogout);
};

export const useLogin = () => {
  const [getUserProfile] = useGetUserProfile();

  const navigate = useNavigate();

  const { setAuthed } = useContext(AuthenticationContext);

  const handleLogin = async (data) => {
    const response = await apiClient.post(API_LOGIN_API, data);

    if (response?.data?.data?.token) {
      await SecureStore.setItemAsync(
        ACCESS_TOKEN_STORAGE_KEY,
        response.data.data.token.accessToken
      );
      await SecureStore.setItemAsync(
        REFRESH_TOKEN_STORAGE_KEY,
        response.data.data.token.refreshToken
      );

      await getUserProfile();

      await navigate("/");

      setAuthed(true);
    }

    return response;
  };

  return useApiRequest(handleLogin);
};

export const useGetSocialProfile = () => {
  const fn = async (userName: string) => {
    const response = await apiClient.get(`/socialProfile/${userName}`);

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useUser = () => {
  return useAppSelector(selectUser);
};

export const useIsDemo = () => {
  return useAppSelector(selectUser)?.email === "hello@octoro.co.uk";
};

export const useGetTimeZones = () => {
  const handleGetTimezones = async () => {
    const response = await apiClient.get("/app/timezones");

    return response?.data;
  };

  return useApiRequest(handleGetTimezones);
};
