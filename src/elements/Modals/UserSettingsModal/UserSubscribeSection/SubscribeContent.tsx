import React from "react";
import { StyleSheet, View } from "react-native";
import { Heading, ModalHeader, Text } from "../../../../components";
import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const SubscribeContent = () => {
  return (
    <View>
      <ModalHeader
        icon={"reefDocsSubscribe"}
        title="Subscribe"
        iconHeight={48}
        iconWidth={48}
      />

      <Text style={styles.paragraph}>
        Please consider supporting Aqua Docs. Your support helps us deliver new
        features and ensures the long-term sustainability of the app.
      </Text>

      <Heading style={styles.oldPrice} variant={5} weight="semiBold">
        £2.99/month or £29.99/year
      </Heading>

      <Text style={styles.discountLabel}>🎉 Early Beta Discount</Text>

      <Text style={{ textAlign: "center", marginBottom: 8 }}>
        We’re currently in beta and offering early access pricing to thank our
        first supporters. The price will increase when we leave beta.
      </Text>

      <Heading style={styles.newPrice} variant={5} weight="semiBold">
        £1.99/month or £19.99/year
      </Heading>

      <Text style={styles.paragraph}>
        We’ll never put existing features behind a paywall. Only new premium
        features will require a subscription.
      </Text>

      <Heading variant={4} weight="semiBold" style={styles.sectionHeading}>
        Pro Plan Includes:
      </Heading>

      <View style={{ marginBottom: 8 }}>
        <Text>• Testing – Dosage</Text>
        <Text>• Testing – ICP Importing</Text>
        <Text>• Testing – Access to AI Models</Text>
        <Text>• Testing – WhatsApp Notifications</Text>
        <Text>• Auto Enrollment into new Pro Features</Text>
      </View>

      <Text style={styles.subText}>
        🔧 Some features are still in development and will be released soon.
      </Text>
    </View>
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
