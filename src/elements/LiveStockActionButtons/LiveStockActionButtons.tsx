import React from "react";
import { TouchableOpacity } from "react-native";

import { Grid, GridItem, Icon } from "../../components";

export const LiveStockActionButtons = ({ buttons }) => {
  return (
    <Grid
      direction="row"
      gap={8}
      justifyContent="space-between"
      alignItems="center"
    >
      {buttons?.map((button, key) => {
        const handlePress = () => {
          return button.onPress();
        };

        return (
          <TouchableOpacity
            key={key}
            onPress={handlePress}
            style={{
              backgroundColor: button.backgroundColor,
              padding: 8,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <GridItem alignItems="center">
              <Icon
                strokeFill={button.iconFill}
                fill={button.iconFill}
                strokeWidth={2}
                name={button.icon}
                width={32}
                height={32}
              />
            </GridItem>
          </TouchableOpacity>
        );
      })}
    </Grid>
  );
};
