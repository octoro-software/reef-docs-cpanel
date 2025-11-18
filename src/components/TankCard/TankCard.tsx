import React from "react";
import { TouchableOpacity, View } from "react-native";

import { AppImage } from "../AppImage/AppImage";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";

import { getAppDimensions } from "../../utility/dimensions";
import { Grid, GridItem } from "../Grid/Grid";
import { useAudience } from "../../hooks/useAudience";

const { width } = getAppDimensions();

export const TankCard: React.FC = ({
  image,
  name,
  onPress,
  onLongPress,
  volume,
  tankType,
  disabled = false,
}) => {
  const { isReef } = useAudience();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
    >
      <View>
        <AppImage
          path={image}
          width={width - 32}
          height={200}
          style={{ borderRadius: 8 }}
        />
        <View
          style={{
            width: "100%",
            position: "absolute",
            left: 0,
            height: 200,
            backgroundColor: "#202124b0",
            borderRadius: 8,
            zIndex: 1,
          }}
        />

        <View style={{ position: "absolute", zIndex: 2, padding: 16 }}>
          <Grid
            direction="row"
            justifyContent="space-between"
            style={{ width: "100%" }}
          >
            <GridItem>
              <Heading variant={5} weight="semiBold" style={{ color: "white" }}>
                {name}
              </Heading>
              <Text style={{ color: "white" }}>{volume}</Text>
            </GridItem>
            {isReef && (
              <GridItem>
                <Text style={{ color: "white" }}>{tankType}</Text>
              </GridItem>
            )}
          </Grid>
        </View>
      </View>
    </TouchableOpacity>
  );
};
