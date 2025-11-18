import React, { useEffect } from "react";
import {
  Button,
  CheckboxField,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
} from "../../../components";
import { useLocation } from "react-router-native";
import { Text, View } from "react-native";
import { getAppDimensions } from "../../../utility/dimensions";
import { REEF_DOCS_BLUE } from "../../../constants";
import { useUser } from "../../../hooks/useAuth";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseUrl } from "../../../api/requestInterceptor";
import { getAppEnv } from "../../../utility/environment";
import * as Application from "expo-application";
import { getAdvertisingId } from "expo-tracking-transparency";

export const DevModal = () => {
  const location = useLocation();

  const [isServerChecked, setIsServerChecked] = React.useState(false);

  const [apiUrl, setApiUrl] = React.useState("");

  const [advertisingId, setAdvertisingId] = React.useState("");

  const checkServer = async () => {
    const result = await AsyncStorage.getItem("usServer");

    setIsServerChecked(result === "true" ? true : false);
  };

  const getApiUrl = async () => {
    const url = await getBaseUrl();

    const idfa = await getAdvertisingId();

    setAdvertisingId(idfa);

    setApiUrl(url);
  };

  useEffect(() => {
    checkServer();
    getApiUrl();
  }, []);

  const handleChangeServer = async () => {
    await AsyncStorage.setItem("usServer", !isServerChecked ? "true" : "false");

    setIsServerChecked((prev) => !prev);
  };

  const { pathname, search, state } = location ?? {};

  const dimensions = getAppDimensions();

  const envVariables = Object.entries(Constants.expoConfig.extra)
    .filter(([key]) => key !== "eas")
    .map(([key, value]) => ({
      label: key,
      value,
    }));

  const user = useUser();

  const properties = [
    {
      label: "Current API URL",
      value: apiUrl,
    },
    {
      label: "Advertising ID",
      value: advertisingId || "Permission not granted",
    },
    {
      label: "System",
      title: true,
    },
    ...envVariables,
    {
      label: "Version",
      title: true,
    },
    {
      label: "Version",
      value: Application.nativeApplicationVersion,
    },
    {
      label: "Build",
      value: Application.nativeBuildVersion,
    },
    {
      label: "Updates",
      title: true,
    },
    {
      label: "Update ID",
      value: Updates.updateId,
    },
    {
      label: "Channel",
      value: Updates.channel,
    },
    {
      label: "Runtime Version",
      value: Updates.runtimeVersion,
    },
    {
      label: "Created At",
      value: Updates.createdAt,
    },
    {
      label: "Navigation",
      title: true,
    },
    {
      label: "Pathname",
      value: pathname,
    },
    {
      label: "Search",
      value: search,
    },
    {
      label: "Search Readable",
      value: decodeURIComponent(search ?? ""),
    },
    {
      label: "State",
      value: JSON.stringify(state),
    },
    {
      label: "Dimensions",
      title: true,
    },
    {
      label: "Width",
      value: dimensions?.width,
    },
    {
      label: "Height",
      value: dimensions?.height,
    },
    {
      label: "Scale",
      value: dimensions?.scale,
    },
    {
      label: "Font Scale",
      value: dimensions?.fontScale,
    },
    {
      label: "User",
      title: true,
    },
    {
      label: "User ID",
      value: "protected",
    },
    {
      label: "Display Name",
      value: user?.displayName,
    },
    {
      label: "User Email",
      value: user?.email,
    },
    {
      label: "User Liquid Unit",
      value: user?.liquidUnit,
    },
    {
      label: "User Measurement Unit",
      value: user?.measurementUnit,
    },
    {
      label: "Timezone",
      value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  ];

  return (
    <ModalComposition>
      <View style={{ padding: 16 }}>
        <Text>Dev Modal</Text>
        <Grid gap={8}>
          {properties.map((property, index) =>
            property?.title ? (
              <View key={index}>
                <Heading
                  variant={4}
                  style={{ color: REEF_DOCS_BLUE }}
                  weight="semiBold"
                >
                  {property.label}
                </Heading>
              </View>
            ) : (
              <Grid direction="row" gap={8} alignItems="flex-start" key={index}>
                <Heading variant={5} weight="semiBold">
                  {property.label}:
                </Heading>
                <Text style={{ marginTop: 2, flex: 1 }}>
                  {property?.value instanceof Date
                    ? property.value.toLocaleString()
                    : property?.value?.toString() || "undefined"}
                </Text>
              </Grid>
            )
          )}

          <Heading
            variant={4}
            style={{ color: REEF_DOCS_BLUE }}
            weight="semiBold"
          >
            Tools
          </Heading>

          <Button
            title="Test Error!"
            onPress={() => {
              throw new Error("This is a test error for Sentry!");
            }}
          />

          <Grid
            direction="row"
            gap={16}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <GridItem>
              <CheckboxField
                checked={isServerChecked}
                onChange={handleChangeServer}
                disabled={getAppEnv() !== "production"}
              />
            </GridItem>
            <GridItem flex={1}>
              <Text>US Server ( Production Only )</Text>
            </GridItem>
          </Grid>
        </Grid>
      </View>
    </ModalComposition>
  );
};
