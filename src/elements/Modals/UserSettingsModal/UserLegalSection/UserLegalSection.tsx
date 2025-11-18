import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { getAppDimensions } from "../../../../utility/dimensions";

import {
  Grid,
  GridItem,
  Icon,
  ModalHeader,
  Text,
} from "../../../../components";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_GREY,
  WHITE,
} from "../../../../constants";
import { UserMenuSection } from "../UserMenuSection.tsx/UserMenuSection";
import WebView from "react-native-webview";

const SCREEN_WIDTH = getAppDimensions().width;

export const UserLegalSection = () => {
  const [step, setStep] = React.useState(0);

  const [activeSection, setActiveSection] = useState("");

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNextStep = (item) => {
    setActiveSection(item?.definition);

    translateX.value = withTiming(-(step + 1) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step + 1);
  };

  const handleBack = () => {
    translateX.value = withTiming(-(step - 1) * SCREEN_WIDTH, {
      duration: 300,
    });

    setStep(step - 1);
  };

  const menuItems = [
    {
      label: "Privacy Policy",
      definition: "privacyPolicy",
      icon: "reefDocsLegal",
    },
    {
      label: "Terms and Conditions",
      definition: "termsAndConditions",
      icon: "reefDocsLegal",
    },
    {
      label: "EULA",
      definition: "eula",
      icon: "reefDocsLegal",
    },
    {
      label: "Disclaimer",
      definition: "disclaimer",
      icon: "reefDocsLegal",
    },
    {
      label: "Acceptable Use Policy",
      definition: "acceptableUsePolicy",
      icon: "reefDocsLegal",
    },
  ];

  return (
    <View>
      <Grid gap={8}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <View style={styles.stepContainer}>
            <ModalHeader
              icon="reefDocsLegal"
              iconWidth={48}
              iconHeight={48}
              title="Legal"
            />

            <FlatList
              data={menuItems}
              renderItem={({ item }) => (
                <UserMenuSection
                  icon={item?.icon}
                  label={item.label}
                  spacer={item.spacer}
                  handleNextStep={() => handleNextStep(item)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </View>

          <View style={styles.stepContainer}>
            <TouchableOpacity
              onPress={() => handleBack()}
              style={[styles.menuWrapper, { marginBottom: 16 }]}
            >
              <Grid direction="row" gap={8}>
                <Icon name="chevronLeft" fill={BLACK} />
                <GridItem flex={1} justifyContent="center">
                  <Text>Back to Legal</Text>
                </GridItem>
              </Grid>
            </TouchableOpacity>
            <WebView
              source={{ uri: getPolicyUrl(activeSection) }}
              style={{ flex: 1 }}
              containerStyle={{ paddingBottom: 150 }}
            />
          </View>
        </Animated.View>
      </Grid>
    </View>
  );
};

const getPolicyUrl = (definition) => {
  const registry = {
    privacyPolicy:
      "https://app.termly.io/policy-viewer/policy.html?policyUUID=d96fd513-10ab-4d65-94ec-5d151f6eb522",
    termsAndConditions:
      "https://app.termly.io/policy-viewer/policy.html?policyUUID=c33f8ec3-7493-4192-8c1d-201867aa7bcb",
    eula: "https://app.termly.io/policy-viewer/policy.html?policyUUID=3697082c-5a86-49de-bac9-4c20a0b50b38",
    disclaimer:
      "https://app.termly.io/policy-viewer/policy.html?policyUUID=db71fdd3-5218-427f-93d7-7b897ff578e6",
    acceptableUsePolicy:
      "https://app.termly.io/policy-viewer/policy.html?policyUUID=743a9995-ec9e-4d8b-b92c-b74746c83dec",
  };

  return registry[definition];
};

const styles = StyleSheet.create({
  text: {
    color: REEF_DOCS_GREY,
    fontSize: 12,
  },
  cardWrapper: {
    alignItems: "center",
  },
  menuHeading: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    marginLeft: -16,
    marginRight: -16,
    padding: 16,
  },
  menuButton: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 2, // Total width for 4 steps
    height: "100%",
  },
  menuWrapper: {
    padding: 8,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    borderBottomColor: INPUT_BORDER_COLOR,
    backgroundColor: WHITE,
    marginTop: -56,
    height: 42,
    justifyContent: "center",
  },
});
