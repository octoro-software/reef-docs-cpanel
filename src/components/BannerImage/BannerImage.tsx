import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { AppImage } from "../AppImage/AppImage";
import { getAppDimensions } from "../../utility/dimensions";

const { width } = getAppDimensions();

export const BannerImage = ({
  onPress,
  aspectRatio,
  url,
  width: cardWidth,
  rounded = true,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={{ flex: 1 }}>
        <AppImage
          path={url ?? ""}
          width={cardWidth ?? width - 32}
          height={"100%"}
          resizeMode="cover"
          transform={false}
          aspectRatio={aspectRatio}
          style={{ borderRadius: rounded ? 8 : 0 }}
        />
      </View>
    </TouchableOpacity>
  );
};
