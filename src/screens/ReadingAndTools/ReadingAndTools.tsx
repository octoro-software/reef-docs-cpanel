import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Grid, Heading, Icon, Text } from "../../components";

import {
  BLACK,
  MORE_PATH,
  READING_AND_TOOLS_ADDITIVES_AND_BUFFERS_PATH,
  READING_AND_TOOLS_LIQUID_CO2_PATH,
  READING_AND_TOOLS_MEDICATIONS_PATH,
  READING_AND_TOOLS_NITRIFYING_BACTERIA_PATH,
  READING_AND_TOOLS_PLANT_CORAL_FOOD_PATH,
  READING_AND_TOOLS_TAP_WATER_CONDITIONERS_PATH,
  WHITE,
} from "../../constants";
import { useNavigate } from "react-router-native";

const menuItems = [
  {
    label: "Calculators",
    spacer: true,
  },
  {
    label: "Tap Water Conditioners",
    path: READING_AND_TOOLS_TAP_WATER_CONDITIONERS_PATH,
  },
  {
    label: "Nitrifying Bacteria",
    path: READING_AND_TOOLS_NITRIFYING_BACTERIA_PATH,
  },
  {
    label: "Liquid Co2",
    path: READING_AND_TOOLS_LIQUID_CO2_PATH,
  },
  {
    label: "Plant Food",
    path: READING_AND_TOOLS_PLANT_CORAL_FOOD_PATH,
  },
  {
    label: "Medication",
    path: READING_AND_TOOLS_MEDICATIONS_PATH,
  },
  {
    label: "Additives and Buffers",
    path: READING_AND_TOOLS_ADDITIVES_AND_BUFFERS_PATH,
  },
  {
    spacer: true,
    label: "Articles",
  },
  {
    label: "Aqua Docs Articles",
    path: MORE_PATH,
  },
];

export const ReadingAndTools = () => {
  const navigate = useNavigate();

  const handleNextStep = (item) => {
    return navigate(item.path);
  };

  return (
    <View style={styles.container}>
      <Heading variant={4} weight="semiBold">
        Reading and Tools
      </Heading>

      <Grid direction="column" style={{ marginTop: 8 }}>
        {menuItems?.map((item, index) => {
          if (item?.spacer) {
            return (
              <Grid
                direction="row"
                gap={6}
                justifyContent="space-between"
                style={styles.itemHeader}
                key={index}
              >
                <Text weight="bold" style={{ fontSize: 16 }}>
                  {item.label}
                </Text>
              </Grid>
            );
          }
          return (
            <TouchableOpacity
              onPress={() => handleNextStep(item)}
              style={styles.itemRow}
              key={index}
            >
              <Grid
                direction="row"
                gap={6}
                justifyContent="space-between"
                key={index}
              >
                <Text>{item.label}</Text>
                <Icon name="chevronRight" fill={BLACK} />
              </Grid>
            </TouchableOpacity>
          );
        })}
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  itemRow: {
    padding: 16,
    backgroundColor: WHITE,
    marginLeft: -16,
    marginRight: -16,
  },
  itemHeader: {
    padding: 16,
    marginLeft: -16,
    marginRight: -16,
  },
});
