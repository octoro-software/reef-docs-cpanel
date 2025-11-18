import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "../Icon/Icon";

export const VideoControls = React.forwardRef(
  ({ videoMute, handleMuteVideo }, videoRef) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleMuteVideo}>
          <Icon name={videoMute ? "volumeOff" : "volume"} />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 9999999,
  },
});
