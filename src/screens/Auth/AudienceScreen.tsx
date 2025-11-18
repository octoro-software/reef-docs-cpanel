import React from "react";
import { TouchableOpacity } from "react-native";

import { Button, Grid, Heading, ProgressBar, GridItem } from "../../components";

import { AppImage } from "../../components/AppImage/AppImage";
import { GuestScreenWrapper } from "../../components/GuestScreenWrapper/GuestScreenWrapper";

import { REEF_DOCS_BLUE, TANK_PATH, WHITE } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "../../hooks/useRedux";
import { setAudience } from "../../store/slices/userConfigSlice";
import { useAudience } from "../../hooks/useAudience";
import { useNavigate } from "react-router-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export const AudienceScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const { audience } = useAudience();

  const navigate = useNavigate();

  const handleContextSwitch = async (context: "reef-docs" | "fresh-docs") => {
    await AsyncStorage.setItem("audience", context);
    dispatch(setAudience(context));
  };

  const handleConfirmChoice = async () => {
    navigate(TANK_PATH);
  };

  return (
    <GuestScreenWrapper style={{ backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        bottomOffset={20}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Grid justifyContent="center" direction="column" gap={16}>
          <ProgressBar percentage={65} height={5} />

          <Heading variant={1} weight="semiBold">
            Fresh or Salt ?
          </Heading>
          <Heading variant={5} weight="regular" style={{ marginTop: -24 }}>
            You can freely switch between these at any time within the app from
            the account menu. This is just to get you started.
          </Heading>

          <Grid direction="column">
            <TouchableOpacity onPress={() => handleContextSwitch("reef-docs")}>
              <GridItem alignItems="center">
                <AppImage
                  transform={true}
                  path={
                    audience === "fresh-docs"
                      ? "/app/shutterstock_2453177503-bw.png"
                      : "/app/shutterstock_2453177503.jpg"
                  }
                  width={"100%"}
                  height={200}
                  style={{
                    borderWidth: 4,
                    borderColor:
                      audience === "reef-docs" ? REEF_DOCS_BLUE : WHITE,
                  }}
                />
                <Heading variant={6} weight="semiBold">
                  Saltwater
                </Heading>
              </GridItem>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleContextSwitch("fresh-docs")}>
              <GridItem alignItems="center">
                <AppImage
                  path={
                    audience === "reef-docs"
                      ? "/app/shutterstock_2080518181-bw.png"
                      : "/app/shutterstock_2080518181.jpg"
                  }
                  width={"100%"}
                  transform={true}
                  height={200}
                  style={{
                    borderWidth: 4,
                    borderColor:
                      audience === "fresh-docs" ? REEF_DOCS_BLUE : WHITE,
                  }}
                />
                <Heading variant={6} weight="semiBold">
                  Freshwater
                </Heading>
              </GridItem>
            </TouchableOpacity>
          </Grid>

          <Button
            variant="secondary"
            title="Confirm"
            onPress={handleConfirmChoice}
          />
        </Grid>
      </KeyboardAvoidingView>
    </GuestScreenWrapper>
  );
};
