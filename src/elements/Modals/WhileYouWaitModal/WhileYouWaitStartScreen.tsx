import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { REEF_DOCS_BLUE, WHITE } from "../../../constants";
import { ImageBackground } from "expo-image";
import { AppImage, Heading, Text } from "../../../components";
import { useGetLeaderboard } from "../../../hooks/useGame";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectGameLeaderboard } from "../../../store/slices/globalSlice";

export const WhileYouWaitStartScreen = ({ opacity, onStart }) => {
  useGetLeaderboard("fish-dodging-logic");

  const leaderboard = useAppSelector(selectGameLeaderboard);

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="auto">
      <ImageBackground
        source={require("./home-background.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <AppImage
            path={"app/aqua-docs-game-logo.png"}
            width={225}
            height={100}
            style={{ marginBottom: 40 }}
          />

          <Heading style={styles.title} variant={1} weight="bold">
            While You Wait
          </Heading>

          <Text style={styles.subtitle}>Swipe to dodge the obstacles!</Text>

          <FlatList
            data={leaderboard}
            style={{ maxHeight: 200, width: "100%" }}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <Text style={{ color: WHITE }}>
                    {item?.user?.displayName}
                  </Text>
                  <Text style={{ color: WHITE, marginLeft: 10 }}>
                    {`${item?.score} seconds`}
                  </Text>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.button} onPress={onStart}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 43,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12, // optional: match modal shape
    overflow: "hidden", // so overlay doesn't spill
  },

  content: {
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },

  title: {
    color: WHITE,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: REEF_DOCS_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: WHITE,
    fontWeight: "bold",
  },
});
