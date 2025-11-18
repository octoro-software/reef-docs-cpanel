import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import apiClient from "../api/apiClient";
import { API_BASE_URL, API_PUSH_NOTIFICATIONS } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LSK_REQUESTED_NOTIFICATIONS } from "../constants/global";
import { useUser } from "./useAuth";
import { useNavigate } from "react-router-native";
import { useGetTankProfile } from "./useTanks";

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

const registerPushNotificationService = async (data) => {
  const response = await apiClient.post(
    `${API_BASE_URL}/${API_PUSH_NOTIFICATIONS}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return response;
};

export const registerForPushNotificationsAsync = async (
  scopes,
  isRegistering = false
) => {
  if (!Device.isDevice) {
    return handleRegistrationError(
      "Must use physical device for push notifications"
    );
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Check current permission status first
  let { status: existingStatus } = await Notifications.getPermissionsAsync();

  await AsyncStorage.setItem(LSK_REQUESTED_NOTIFICATIONS, "true");

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      return { error: true };
    }
  }

  // Ensure your project ID is dynamically pulled from Constants
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    return handleRegistrationError("Project ID not found");
  }

  // Now safely get Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  // Register the token with your backend API
  return await registerPushNotificationService({
    token: tokenData.data,
    scopes,
    isRegistering,
  });
};

export const usePushNotificationCheck = () => {
  const user = useUser();

  const handleCheckHasRequestedPermissionBefore = async () => {
    const hasChecked =
      (await AsyncStorage.getItem(LSK_REQUESTED_NOTIFICATIONS)) === "true";

    if (!hasChecked) {
      await registerForPushNotificationsAsync(
        {
          marketing: user?.notification?.marketingScope || false,
          tasks: user?.notification?.taskScope || false,
          reminders: user?.notification?.reminderScope || false,
          posts: user?.notification?.postScope || false,
          system: user?.notification?.systemScope || false,
        },
        true
      ).catch((error) => {
        console.error("Error registering for push notifications:", error);
        return { error: true };
      });

      await AsyncStorage.setItem(LSK_REQUESTED_NOTIFICATIONS, "true");
    }
  };

  useEffect(() => {
    handleCheckHasRequestedPermissionBefore();
  }, []);
};

export const useNotificationHandler = () => {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const navigate = useNavigate();

  const [pushNotificationReceived, setPushNotificationReceived] =
    useState(true);

  const [pushNotificationResolver] = usePushNotificationResolver();

  useEffect(() => {
    // Foreground notification received
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Optionally show toast or custom banner
      });

    // Background/foreground tap
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNavigationFromNotification(response);
      });

    // Cold start tap
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        setPushNotificationReceived(true);
        handleNavigationFromNotification(response);
      } else {
        setPushNotificationReceived(false);
      }
    };

    checkInitialNotification();

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const handleNavigationFromNotification = async (response) => {
    const data = response?.notification?.request?.content?.data;

    if (!data) {
      setPushNotificationReceived(false);
      return;
    }

    const url = await pushNotificationResolver(data);

    if (url) {
      navigate(url);
      setPushNotificationReceived(false);
    } else {
      setPushNotificationReceived(false);
    }
  };

  return pushNotificationReceived;
};

const usePushNotificationResolver = () => {
  const [getTankProfile] = useGetTankProfile();

  const fn = async (data) => {
    switch (data?.type) {
      case "task":
        return getTankProfile(data?.tankId)
          .catch((error) => {
            return `/explore`;
          })
          .then(() => {
            return `/tanks/:id/tasks`;
          });
      case "post_mention":
        return data?.path;
      default:
        return false;
    }
  };

  return [fn];
};
