import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useGetTanks } from "../../hooks/useTanks";

import { getAppDimensions } from "../../utility/dimensions";

import { Heading } from "../../components";

import { SettingsTabs } from "../../components/SettingsTabs/SettingsTabs";
import { TankSettingsForm } from "../../components/SettingForms/TankSettingsForm/TankSettingsForm";
import { FeedSettingsForm } from "../../components/SettingForms/FeedSettingsForm/FeedSettingsForm";
import { DashboardSettingsForm } from "../../components/SettingForms/DashboardSettingsForm/DashboardSettingsForm";

const { height } = getAppDimensions();

export const PanelSettingsScreen: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("tank");

  const [getTanks] = useGetTanks();

  useEffect(() => {
    getTanks();
  }, []);

  return (
    <View style={styles.root}>
      <Heading
        variant={5}
        weight="semiBold"
        style={{ color: "white", marginBottom: 16 }}
      >
        Settings
      </Heading>

      <SettingsTabs
        activeTab={activeMenu}
        onTabPress={(definition) => setActiveMenu(definition)}
      />

      <ScrollView
        style={{
          marginTop: 16,
          borderRadius: 16,
          backgroundColor: "rgba(16, 24, 44, 0.95)",
          padding: 16,
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {activeMenu === "tank" && <TankSettingsForm />}

        {activeMenu === "feed" && <FeedSettingsForm />}

        {activeMenu === "dashboard" && <DashboardSettingsForm />}
      </ScrollView>
    </View>
  );
};

const menu = [
  {
    label: "Tank",
    definition: "tank",
  },
  {
    label: "Feed",
    definition: "feed",
  },
];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#171c2eff",
    height: height,
    padding: 16,
  },
});
