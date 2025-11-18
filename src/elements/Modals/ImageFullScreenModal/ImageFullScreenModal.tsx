import React from "react";
import { StyleSheet, View } from "react-native";

import { BLACK } from "../../../constants";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { AppImage } from "../../../components";

export const ImageFullScreenModal = ({ imageUri, height }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Zoomable
        doubleTapScale={3}
        isSingleTapEnabled
        isDoubleTapEnabled
        isPinchEnabled={false}
      >
        <AppImage
          path={imageUri}
          height={height}
          style={{ resizeMode: "contain" }}
        />
      </Zoomable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BLACK,
  },
});
