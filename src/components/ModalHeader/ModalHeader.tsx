import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { Grid } from "../Grid/Grid";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";
import { Icon } from "../Icon/Icon";
import { BLACK } from "../../constants";

export const ModalHeader = ({
  image = false,
  title = "",
  content = null,
  icon = null,
  iconWidth = 32,
  iconHeight = 32,
  iconWrapperStyle = {},
  center = false,
}) => {
  return (
    <Grid gap={8} justifyContent="center" alignItems="center">
      {icon ? (
        <View
          style={[styles.imageWrapper, styles.iconWrapper, iconWrapperStyle]}
        >
          <Icon
            name={icon}
            width={iconWidth}
            height={iconHeight}
            fill={BLACK}
          />
        </View>
      ) : (
        <View style={styles.imageWrapper}></View>
      )}

      <Heading variant={5} weight="regular">
        {title}
      </Heading>

      {content && (
        <Text style={center ? { textAlign: "center" } : {}}>{content}</Text>
      )}
    </Grid>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 50,
    width: 64,
    height: 64,
    borderWidth: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
