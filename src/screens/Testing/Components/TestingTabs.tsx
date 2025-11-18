import React from "react";
import { TouchableOpacity } from "react-native";

import { Grid, Text } from "../../../components";

import { WHITE } from "../../../constants";

export const TestingTabs = ({ tabNames, activeTab, handleTabPress }) => {
  return (
    <Grid direction="row" gap={1} style={{ marginTop: 8 }}>
      {tabNames.map((name, index) => (
        <TouchableOpacity
          key={name}
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              backgroundColor: WHITE,
              marginBottom: 16,
            },
            index === 0
              ? { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
              : {},
            index === tabNames.length - 1
              ? { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
              : {},
          ]}
          onPress={() => handleTabPress(index, name)}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: activeTab === name ? "bold" : "normal",
            }}
          >
            {name}
          </Text>
        </TouchableOpacity>
      ))}
    </Grid>
  );
};
