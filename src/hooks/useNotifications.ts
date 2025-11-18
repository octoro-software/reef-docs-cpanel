import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import apiClient from "../api/apiClient";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  selectNotificationMenuActive,
  selectNotifications,
  setNotifications,
} from "../store/slices/globalSlice";

export const useNotificationsAlerts = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const notificationData = useAppSelector(selectNotifications);
  const notificationsActive = useAppSelector(selectNotificationMenuActive);
  const dispatch = useAppDispatch();


  const canPoll = () =>
    appStateRef.current === "active" && !notificationsActive;

  const getNotifications = async () => {
    if (appStateRef.current !== "active") return;

    try {
      const response = await apiClient.get("notifications");
      const newData = response?.data?.data;


      const oldJson = JSON.stringify(notificationData);
      const newJson = JSON.stringify(newData);

      if (oldJson !== newJson) {
        dispatch(setNotifications(newData));
      }
    } catch (error) {
      // Avoid noisy logs while locked/background; keep one line
      console.warn(
        "Notifications fetch skipped/failed:",
        error?.message ?? error
      );
    }
  };

  // Keep app state in a ref and react to changes
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      appStateRef.current = next;

      // When returning to active (i.e., unlock), do an immediate fetch
      if (next === "active" && !notificationsActive) {
        void getNotifications();
      }

      // Reset polling based on new state
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (canPoll()) {
        intervalRef.current = setInterval(getNotifications, 10_000);
      }
    });

    return () => {
      sub.remove();
    };
  }, [notificationsActive]); // re-evaluate when menu opens/closes

  // Initial fetch on mount (only if active)
  useEffect(() => {
    if (appStateRef.current === "active") {
      void getNotifications();
    }
  }, []);

  // Manage polling when the menu state changes (and current app state)
  useEffect(() => {
    // Clean any existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Start only if we’re allowed to poll
    if (canPoll()) {
      intervalRef.current = setInterval(getNotifications, 10_000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [notificationsActive]);
};
