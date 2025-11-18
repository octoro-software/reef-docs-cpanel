import React from "react";
import { Button } from "../../components";
import apiClient from "../../api/apiClient";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

type PaymentProps = {
  buttonTitle?: string;

  vendorId?: string;
};

export const PaymentElement: React.FC<PaymentProps> = ({
  buttonTitle = "Checkout",
  vendorId = null,
}) => {
  const [paymentLoading, setPaymentLoading] = React.useState(false);

  const getPaymentInfo = async () => {
    const paymentIntent = await apiClient.get(
      vendorId
        ? `orders/checkoutPaymentIntentBasket?vendorId=${vendorId}`
        : "orders/checkoutPaymentIntentBasket"
    );

    const { clientSecret, ephemeralKey, customerId } =
      paymentIntent?.data?.paymentIntent || {};

    return {
      clientSecret,
      ephemeralKey,
      customerId,
    };
  };

  const initializePaymentSheet = async () => {
    const { clientSecret, ephemeralKey, customerId } = await getPaymentInfo();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Aqua Docs",
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });

    if (!error) {
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();
  };

  return (
    <Button
      title={buttonTitle}
      onPress={openPaymentSheet}
      isLoading={paymentLoading}
    />
  );
};
