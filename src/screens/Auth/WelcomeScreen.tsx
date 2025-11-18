import React, { useEffect } from "react";
import { useNavigate } from "react-router-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import branch from "react-native-branch";

import { Button, Grid, Heading, ScreenWrapper, Text } from "../../components";

import { Logo } from "../../components/Logo/Logo";
import { sendEvent } from "../../utility/analytics";

import { LOGIN_PATH, REEF_DOCS_GREY, REGISTER_PATH } from "../../constants";

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = async (path) => {
    await navigate(path);
  };

  useEffect(() => {
    // Handle cold start
    branch.getLatestReferringParams().then(({ params, error }) => {
      if (error) {
        return;
      }

      const campaign = params?.["~campaign"];
      const channel = params?.["~channel"];

      if (campaign && channel) {
        registerInstallEvent(campaign, channel);
      }
    });

    // Handle warm start
    const unsubscribe = branch.subscribe(({ error, params, uri }) => {
      if (error) {
        return;
      }

      const campaign = params?.["~campaign"];
      const channel = params?.["~channel"];

      if (campaign && channel) {
        registerInstallEvent(campaign, channel);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate]);

  const registerInstallEvent = async (campaignId, channel) => {
    await AsyncStorage.setItem(
      "campaign",
      JSON.stringify({ campaignId, channel })
    );

    sendEvent(
      "APP_INSTALL_VIA_CAMPAIGN",
      {
        campaignId,
        channel,
      },
      true
    );
  };

  const welcomeText = `Join Us & Simplify Your Aquarium Management with Aqua Docs!`;

  return (
    <ScreenWrapper style={{ backgroundColor: "#fff" }}>
      <Grid alignItems="center" justifyContent="center" gap={16}>
        <Logo />

        <Heading variant={1} weight="semiBold">
          Welcome!
        </Heading>

        <Text style={styles.subTitle} weight="regular">
          {welcomeText}
        </Text>

        <Button
          onPress={() => handleNavigate(LOGIN_PATH)}
          title="Existing Account"
          variant="secondary"
        />

        <Button
          onPress={() => handleNavigate(REGISTER_PATH)}
          title="Register"
          variant="primary"
        />
      </Grid>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: REEF_DOCS_GREY,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});
