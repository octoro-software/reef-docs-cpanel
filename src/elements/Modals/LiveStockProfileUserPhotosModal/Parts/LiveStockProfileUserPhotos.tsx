import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { View, StyleSheet, FlatList } from "react-native";

import {
  AppImage,
  Button,
  ModalComposition,
  Text,
} from "../../../../components";

import { getAppDimensions } from "../../../../utility/dimensions";
import { WHITE } from "../../../../constants";
import { ModalNoDataFallback } from "../../../../components/ModalNoDataFallback/ModalNoDataFallback";

const width = getAppDimensions().width;

export const LiveStockProfileUserPhotos = ({ handleNextStep, data, icon }) => {
  const itemSpacing = 1;
  const itemWidth = width - 2 * itemSpacing;

  return (
    <ModalComposition
      padding={false}
      footerStyle={{
        width: width + 16,
        paddingLeft: 32,
      }}
      renderFooter={() => (
        <Button title="Contribute" onPress={() => handleNextStep(1)} />
      )}
    >
      {data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.modelId.toString()}
          renderItem={({ item }) => {
            return (
              <View
                style={[styles.imageContainer, { height: 300, width: width }]}
              >
                <AppImage
                  path={item.path}
                  height={300}
                  width={itemWidth}
                  style={styles.image}
                  transform={false}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                  style={styles.bottomFade}
                />
                <View style={styles.userNameOverlayContainer}>
                  <Text style={styles.userNameOverlayText}>
                    @{item?.user?.userName}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View style={{ paddingTop: 16 }}>
          <ModalNoDataFallback
            title="No Image Contributions"
            icon={icon ?? "reefDocsHelp"}
            text="Be the first, show the community this animal."
          />
        </View>
      )}
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    overflow: "hidden",
    margin: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  userNameOverlayContainer: {
    position: "absolute",
    bottom: 8,
    left: 16,
    zIndex: 10,
  },
  userNameOverlayText: {
    fontSize: 12,
    color: WHITE,
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 1,
    right: 1,
    height: 100,
    zIndex: 9,
  },
});

export default LiveStockProfileUserPhotos;
