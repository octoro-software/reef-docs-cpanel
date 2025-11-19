import React from "react";
import { useNavigate } from "react-router-native";
import { StyleSheet } from "react-native";

import { Button, Grid, Heading, ScreenWrapper, Text } from "../../components";

import { Logo } from "../../components/Logo/Logo";

import { LOGIN_PATH, REEF_DOCS_GREY, REGISTER_PATH } from "../../constants";

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = async (path) => {
    await navigate(path);
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
