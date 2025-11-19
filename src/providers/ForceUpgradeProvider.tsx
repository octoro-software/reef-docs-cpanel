// NetworkProvider.tsx
import React, { useEffect, useState } from "react";

import { ActivityIndicator, Platform, SafeAreaView } from "react-native";
import { View } from "react-native";
import { REEF_DOCS_BLUE, WHITE } from "../constants";
import { StyleSheet } from "react-native";
import apiClient from "../api/apiClient";
import { ForceUpgrade } from "../elements/ForceUpgrade/ForceUpgrade";
import BootSplash from "react-native-bootsplash";
import { Logo } from "../components/Logo/Logo";
import { getAppVersionInfo } from "../utility/getAppVersion";

const isVersionGreater = (a: string, b: string): boolean => {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal > bVal) return true;
    if (aVal < bVal) return false;
  }
  return false;
};

export const ForceUpgradeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [upgradeRequired, setUpgradeRequired] = useState<Boolean | "pending">(
    "pending"
  );

  const handleCheck = async () => {
    try {
      const response = await apiClient.get("/appVersion");
      const latestVersion = response?.data?.data?.version;
      const latestBuild = response?.data?.data?.build;
      const latestIosBuild = response?.data?.data?.iosBuild;

      const { version: currentVersion, buildNumber: currentBuildNumber } =
        getAppVersionInfo();

      const versionIsOutdated = isVersionGreater(latestVersion, currentVersion);

      const buildIsOutdated =
        Platform.OS === "ios"
          ? latestIosBuild > currentBuildNumber
          : latestBuild > currentBuildNumber;

      if (versionIsOutdated || buildIsOutdated) {
        BootSplash.hide();
        setUpgradeRequired(true);
      } else {
        setUpgradeRequired(false);
      }
    } catch (error) {
      setUpgradeRequired(false);
    }
  };

  useEffect(() => {
    handleCheck();
  }, []);

  if (upgradeRequired === "pending") {
    return <></>;
  }

  if (upgradeRequired) {
    return <ForceUpgrade />;
  } else {
    return children;
  }
};
