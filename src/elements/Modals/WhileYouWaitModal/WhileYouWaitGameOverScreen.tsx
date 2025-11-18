import { ImageBackground } from "expo-image";
import React, { useEffect } from "react";

import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSubmitLeaderboardEntry } from "../../../hooks/useGame";

import { AppImage, Heading } from "../../../components";

import { REEF_DOCS_BLUE, WHITE } from "../../../constants";

import { useAppSelector } from "../../../hooks/useRedux";

import { selectGameLeaderboard } from "../../../store/slices/globalSlice";

export const WhileYouWaitGameOverScreen = ({
  opacity,
  timeSurvived,
  onRestart,
}) => {
  const time = Number(timeSurvived).toFixed(1);

  const leaderboard = useAppSelector(selectGameLeaderboard);

  const [postScore] = useSubmitLeaderboardEntry();

  const handlePostScore = async () => {
    await postScore({
      score: Number(time),
      gameId: "fish-dodging-logic",
    });
  };

  useEffect(() => {
    handlePostScore();
  }, []);

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
            Game Over
          </Heading>
          <Text style={styles.subtitle}>You survived {time} seconds!</Text>

          <FlatList
            data={leaderboard}
            style={{ maxHeight: 200, width: "100%" }}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <Text style={{ color: WHITE }}>@{item?.user?.userName}</Text>
                  <Text style={{ color: WHITE, marginLeft: 10 }}>
                    {`${item?.score} seconds`}
                  </Text>
                </View>
              );
            }}
          />
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Text style={styles.buttonText}>Play Again</Text>
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
    backgroundColor: "rgba(0,0,0,0.8)",
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
