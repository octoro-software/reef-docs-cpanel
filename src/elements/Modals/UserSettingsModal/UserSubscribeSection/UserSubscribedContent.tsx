import React from "react";
import { StyleSheet, View } from "react-native";
import { Heading, ModalHeader, Text } from "../../../../components";
import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const UserSubscribedContent = () => {
  return (
    <View>
      <ModalHeader
        icon={"reefDocsFish"}
        title="Active Plan"
        iconHeight={48}
        iconWidth={48}
        iconWrapperStyle={{ borderColor: REEF_DOCS_BLUE, borderWidth: 4 }}
      />

      <Text style={styles.paragraph} weight="bold">
        Pro
      </Text>

      <Text style={styles.paragraph}>
        You are currently subscribed to our Pro Plan. Thankyou for your support.
      </Text>

      <Heading variant={4} weight="semiBold" style={styles.sectionHeading}>
        Your Plan Includes:
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
