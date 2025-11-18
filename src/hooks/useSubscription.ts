import { useEffect, useState } from "react";
import { useLocation } from "react-router-native";

import { useUser } from "./useAuth";

import apiClient from "../api/apiClient";

import {
  API_GET_ANNUAL_PAYMENT_URL,
  API_GET_MONTHLY_PAYMENT_URL,
  API_GET_PAYMENT_MANAGEMENT_URL,
} from "../constants";

export const useSubscriptions = () => {
  const [status, setStatus] = useState({
    requestingPaymentUrl: false,
    requestingManagementUrl: false,
    awaitingConfirmation: false,
    subscribed: false,
    hasExpiredTrial: false,
    onTrial: false,
  });

  const user = useUser();

  const startSubscription = async (monthly) => {
    setStatus((prevState) => ({
      ...prevState,
      requestingPaymentUrl: true,
    }));

    const response = await apiClient.get(
      monthly ? API_GET_MONTHLY_PAYMENT_URL : API_GET_ANNUAL_PAYMENT_URL
    );

    if (response?.status === 200) {
      const paymentLink = response.data;

      return paymentLink;
    }

    setStatus((prevState) => ({
      ...prevState,
      requestingPaymentUrl: false,
      awaitingConfirmation: true,
    }));
  };

  const manageSubscription = async () => {
    setStatus((prevState) => ({
      ...prevState,
      requestingManagementUrl: true,
    }));

    const response = await apiClient.get(API_GET_PAYMENT_MANAGEMENT_URL);

    if (response?.status === 200) {
      const managementLink = response.data;

      return managementLink;
    }

    setStatus((prevState) => ({
      ...prevState,
      requestingManagementUrl: false,
      awaitingConfirmation: true,
    }));
  };

  const useSubscribedDeepLinkCallback = (): Boolean => {
    const [subscribed, setSubscribed] = useState(false);

    const location = useLocation();

    useEffect(() => {
      if (location.state?.subscribed && status.awaitingConfirmation) {
        const subscribed = Boolean(location.state.subscribed);

        if (subscribed) {
          setStatus((prevState) => ({
            ...prevState,
            awaitingConfirmation: false,
            subscribed: true,
          }));
        }
      }
    }, [location.state]);

    return subscribed;
  };

  useEffect(() => {
    if (user) {
      setStatus((prevState) => ({
        ...prevState,
        subscribed: user?.subscribed ?? false,
        onTrial: user?.onTrial ?? false,
        hasExpiredTrial: user?.hasExpiredTrial ?? false,
      }));
    }
  }, [user]);

  return {
    startSubscription,
    manageSubscription,
    status,
    useSubscribedDeepLinkCallback,
  };
};
