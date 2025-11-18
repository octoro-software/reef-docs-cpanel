import React from "react";
import { View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

import { Grid, GridItem } from "../../components";
import { ProgressChart } from "../../components/Charts/Core/ProgressChart/ProgressChart";

const { width } = getAppDimensions();

export const TestingRoScreen = () => {
  const roData = [
    {
      label: "Ca",
      measure: "mg/l",
      value: 411.74,
      target: 420,
    },
    {
      label: "Bo",
      measure: "mg/l",
      value: 4.38,
      target: 6,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
    {
      label: "Br",
      measure: "mg/l",
      value: 68.38,
      target: 70,
    },
  ];

  return (
    <Grid>
      <Grid gap={8}>
        <Grid
          direction="row"
          gap={8}
          style={{ flexWrap: "wrap", alignItems: "center" }}
        >
          {roData?.map((item, index) => {
            return (
              <GridItem
                key={index}
                flex={1}
                style={{ minWidth: width / 3 - 16 }}
              >
                <View style={{ backgroundColor: "white", padding: 16 }}>
                  <ProgressChart
                    percentage={(item.value / item.target) * 100}
                    value={item.value}
                    size={width / 3 - 20}
                    label={item.label}
                    measurement={item.measure}
                  />
                </View>
              </GridItem>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
