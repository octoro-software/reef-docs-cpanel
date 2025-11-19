import React from "react";
import { useNotificationHandler } from "../hooks/usePushNotifications";

export const PushNotificationProvider = ({ children }) => {
  // This provider can be used to handle push notifications
  // For example, you can set up listeners for incoming notifications
  // and manage notification state here.

  const pushNotificationReceived = useNotificationHandler();

  if (pushNotificationReceived) {
    return <></>;
  }

  return <React.Fragment>{children}</React.Fragment>;
};
