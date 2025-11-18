import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  ModalHeader,
  SlideInModal,
  Text,
} from "../../../../components";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { useSubscriptions } from "../../../../hooks/useSubscription";
import { getAppDimensions } from "../../../../utility/dimensions";
import { useGetUserProfile } from "../../../../hooks/useAuth";
import { SubscribeContent } from "./SubscribeContent";
import { UserSubscribedContent } from "./UserSubscribedContent";

export const UserSubscribeSection = ({ footerStyle = true }) => {
  const [showWebViewModal, setShowWebViewModal] = React.useState(false);
  const [webViewUrl, setWebViewUrl] = React.useState(null);
  const [refreshBilling, setRefreshBilling] = React.useState(false);
  const [activeLoadingType, setActiveLoadingType] = React.useState(null); // "monthly" | "yearly" | null

  const [getProfile] = useGetUserProfile();

  const {
    startSubscription,
    manageSubscription,
    status,
    useSubscribedDeepLinkCallback,
  } = useSubscriptions();

  const subscriptionMethod = status.subscribed
    ? manageSubscription
    : startSubscription;

  useSubscribedDeepLinkCallback();

  const handleSubscribePress = async (isMonthly) => {
    setActiveLoadingType(isMonthly);

    const url = await subscriptionMethod(isMonthly === "monthly");

    setWebViewUrl(url);
    setShowWebViewModal(true);
  };

  const handlePaymentViewClose = () => {
    setShowWebViewModal(false);
    setActiveLoadingType(null);
  };

  const handleSubscribeCheck = async () => {
    await getProfile();
    setActiveLoadingType(null);
    setRefreshBilling(false);
  };

  useEffect(() => {
    if (refreshBilling) {
      handleSubscribeCheck();
    }
  }, [refreshBilling]);

  const dimensions = getAppDimensions();

  return (
    <>
      <SlideInModal
        visible={showWebViewModal}
        onClose={handlePaymentViewClose}
        height={dimensions.height - 64}
        scrollView={false}
        title="Payment"
      >
        <WebView
          source={{ uri: webViewUrl }}
          allowsBackForwardNavigationGestures={false}
          style={{ flex: 1 }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes("paymentLoading")) {
              setShowWebViewModal(false);
              setRefreshBilling(true);
            }
          }}
        />
      </SlideInModal>
      <ModalComposition
        footerStyle={footerStyle ? { left: 1, paddingBottom: 32 } : {}}
        renderFooter={() =>
          status.subscribed ? (
            <Button
              title={"Manage Subscription"}
              variant="secondary"
              onPress={() => handleSubscribePress("manage")}
              isLoading={activeLoadingType === "manage"}
            />
          ) : (
            <Grid gap={8}>
              <Button
                title={"Monthly Subscription"}
                variant="secondary"
                onPress={() => handleSubscribePress("monthly")}
                isLoading={activeLoadingType === "monthly"}
              />
              <Button
                title={"Yearly Subscription"}
                variant="secondary"
                onPress={() => handleSubscribePress("yearly")}
                isLoading={activeLoadingType === "yearly"}
              />
            </Grid>
          )
        }
      >
        <View style={styles.wrapper}>
          {status?.subscribed ? (
            <UserSubscribedContent />
          ) : (
            <SubscribeContent />
          )}
        </View>
      </ModalComposition>
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  paragraph: {
    marginBottom: 16,
    textAlign: "center",
  },
  oldPrice: {
    marginVertical: 16,
    textAlign: "center",
    textDecorationLine: "line-through",
    color: "#999",
  },
  discountLabel: {
    textAlign: "center",
    fontWeight: "bold",
    color: REEF_DOCS_BLUE,
    marginBottom: 4,
    fontSize: 16,
  },
  newPrice: {
    marginVertical: 8,
    textAlign: "center",
    color: REEF_DOCS_BLUE,
  },
  sectionHeading: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});
