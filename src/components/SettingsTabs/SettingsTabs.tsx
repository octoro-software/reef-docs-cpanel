import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Grid } from "../Grid/Grid";
import { WHITE } from "../../constants";
import { Text } from "../Text/Text";

export const settingsTabMenu = [
  {
    label: "Tank",
    definition: "tank",
  },
  {
    label: "Feed",
    definition: "feed",
  },
  {
    label: "Dashboard",
    definition: "dashboard",
  },
  {
    label: "Dosing",
    definition: "dosing",
  },
];

export const SettingsTabs: React.FC = ({ onTabPress, activeTab }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(16, 24, 44, 0.95)",
        borderRadius: 16,
      }}
    >
      <Grid direction="row" gap={16}>
        {settingsTabMenu.map((item) => (
          <TouchableOpacity
            onPress={() => onTabPress(item?.definition)}
            key={item.definition}
          >
            <Grid
              direction="row"
              gap={8}
              style={{
                padding: 16,
                borderBottomWidth: activeTab === item.definition ? 2 : 0,
                borderBottomColor: WHITE,
              }}
            >
              <Text
                style={{
                  color: WHITE,
                  fontWeight: activeTab === item.definition ? "bold" : "normal",
                }}
              >
                {item.label}
              </Text>
            </Grid>
          </TouchableOpacity>
        ))}
      </Grid>
    </View>
  );
};
