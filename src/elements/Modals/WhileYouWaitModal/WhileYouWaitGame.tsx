import React, { useRef, useState } from "react";
import { View, Dimensions, StyleSheet, Text, Image } from "react-native";

import { GameEngine } from "react-native-game-engine";
import LottieView from "lottie-react-native";
import { ImageBackground } from "react-native";
import { AppImage } from "../../../components";

const { width, height } = Dimensions.get("window");

const AVATAR_RENDER_SIZE = 80;
const OBSTACLE_SIZE = 40;
const AVATAR_Y_POSITION = height - 260;

const OBSTACLE_IMAGES = [
  require("./rock-asset.png"),
  require("./sea-urchin-asset.png"),
  require("./coral-asset.png"),
];

const GAME_BACKGROUNDS = [
  require("./assets/backgrounds/game-background.png"),
  require("./assets/backgrounds/game-background-2.png"),
  require("./assets/backgrounds/game-background-3.png"),
  require("./assets/backgrounds/game-background-4.png"),
];

const POWERUP_IMAGES = {
  shield: require("./assets/power-ups/shield-powerup-asset.png"),
  slow: require("./assets/power-ups/slow-powerup-asset.png"),
};

const POWERUP_SIZE = 40;

// Avatar renderer
const Avatar = ({ position }) => (
  <View
    style={{
      position: "absolute",
      top: AVATAR_Y_POSITION,
      left: position.x,
      width: AVATAR_RENDER_SIZE,
      height: AVATAR_RENDER_SIZE,
      pointerEvents: "none",
      overflow: "hidden", // optional: clips excess Lottie if needed
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <LottieView
      source={require("./fish.json")}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  </View>
);

const PowerUp = ({ x, y, source }) => (
  <View
    style={{
      position: "absolute",
      left: x + POWERUP_SIZE / 2 - 25,
      top: y + POWERUP_SIZE / 2 - 25,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.1)", // subtle glow container
      shadowColor: "#00ffff", // aqua glow (you can change color based on powerup type)
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 10, // Android shadow
    }}
  >
    <Image
      source={source}
      style={{
        width: POWERUP_SIZE,
        height: POWERUP_SIZE,
        resizeMode: "contain",
      }}
    />
  </View>
);

const PowerUpDisplay = ({ shield, slowUntil }) => {
  const now = performance.now();
  const slowTimeLeft = Math.max(0, (slowUntil - now) / 1000).toFixed(1);

  return (
    <View style={styles.powerupContainer}>
      {shield && (
        <View style={styles.powerupIconContainer}>
          <Image source={POWERUP_IMAGES.shield} style={styles.powerupIcon} />
          <Text style={styles.powerupText}>Shield</Text>
        </View>
      )}
      {slowUntil > now && (
        <View style={styles.powerupIconContainer}>
          <Image source={POWERUP_IMAGES.slow} style={styles.powerupIcon} />
          <Text style={styles.powerupText}>{slowTimeLeft}s</Text>
        </View>
      )}
    </View>
  );
};

// Obstacle renderer
const Obstacle = ({ x, y, source }) => (
  <Image
    source={source}
    style={{
      position: "absolute",
      width: OBSTACLE_SIZE,
      height: OBSTACLE_SIZE,
      left: x,
      top: y,
      resizeMode: "contain",
    }}
  />
);

// Difficulty system
const getDifficultyConfig = (time, speedModifier = 1) => {
  if (time < 10) return { speed: 4 * speedModifier, max: 1 };
  if (time < 20) return { speed: 5 * speedModifier, max: 2 };
  if (time < 30) return { speed: 6 * speedModifier, max: 3 };
  if (time < 40) return { speed: 6 * speedModifier, max: 4 };
  if (time < 50) return { speed: 7 * speedModifier, max: 5 };
  if (time < 60) return { speed: 8 * speedModifier, max: 5 };
  if (time < 70) return { speed: 9 * speedModifier, max: 6 };
  return { speed: 7 * speedModifier, max: 4 };
};

// Game loop system
const GameLoop = (entities, { time, touches, dispatch }) => {
  const avatar = entities.avatar;
  const now = time.current;
  const dt = now - (entities.lastTick || 0);
  entities.lastTick = now;

  const isSlowed = entities.powerUpState?.slowUntil > now;
  const speedModifier = isSlowed ? 0.5 : 1;
  const { speed, max } = getDifficultyConfig(
    entities.timeSurvived,
    speedModifier
  );
  // Handle touch movement
  touches
    .filter((t) => t.type === "move")
    .forEach((t) => {
      const centerX = t.event.pageX;
      const halfAvatar = AVATAR_RENDER_SIZE / 2;
      const clampedCenterX = Math.max(
        halfAvatar,
        Math.min(centerX, width - halfAvatar)
      );
      avatar.position.x = clampedCenterX - halfAvatar;
    });

  // Obstacle update
  const toRemove = [];

  Object.entries(entities).forEach(([key, entity]) => {
    if (key.startsWith("obstacle_")) {
      entity.y += speed;

      // Remove if off screen
      if (entity.y > height) {
        toRemove.push(key);
      }

      // Collision
      const obsX = entity.x;
      const obsY = entity.y;
      const centerX = avatar.position.x + AVATAR_RENDER_SIZE / 2;
      const avatarLeft = centerX - 20;
      const avatarRight = centerX + 20;
      const avatarTop = AVATAR_Y_POSITION + AVATAR_RENDER_SIZE / 2 - 20;
      const avatarBottom = AVATAR_Y_POSITION + AVATAR_RENDER_SIZE / 2 + 20;

      const collides =
        obsX < avatarRight &&
        obsX + OBSTACLE_SIZE > avatarLeft &&
        obsY < avatarBottom &&
        obsY + OBSTACLE_SIZE > avatarTop;

      if (collides) {
        if (entities.powerUpState?.shield) {
          entities.powerUpState.shield = false; // consume shield
          toRemove.push(key); // remove the obstacle
        } else {
          dispatch({ type: "game-over" });
        }
      }
    }

    if (key.startsWith("powerup_")) {
      entity.y += speed;
      if (entity.y > height) toRemove.push(key);

      // Collision with avatar
      const centerX = avatar.position.x + AVATAR_RENDER_SIZE / 2;
      const avatarLeft = centerX - 20;
      const avatarRight = centerX + 20;
      const avatarTop = AVATAR_Y_POSITION + AVATAR_RENDER_SIZE / 2 - 20;
      const avatarBottom = AVATAR_Y_POSITION + AVATAR_RENDER_SIZE / 2 + 20;

      const collides =
        entity.x < avatarRight &&
        entity.x + POWERUP_SIZE > avatarLeft &&
        entity.y < avatarBottom &&
        entity.y + POWERUP_SIZE > avatarTop;

      if (collides) {
        if (entity.type === "shield") {
          entities.powerUpState.shield = true;
        }
        if (entity.type === "slow") {
          entities.powerUpState.slowUntil = now + 5000; // 5 seconds
        }
        toRemove.push(key);
      }
    }
  });

  // Clean up off-screen obstacles
  toRemove.forEach((key) => {
    delete entities[key];
  });

  // Add new obstacles
  const currentObstacles = Object.keys(entities).filter((k) =>
    k.startsWith("obstacle_")
  ).length;

  if (currentObstacles < max) {
    const id = entities.nextObstacleId++;
    const x = Math.random() * (width - OBSTACLE_SIZE);
    const randomImage =
      OBSTACLE_IMAGES[Math.floor(Math.random() * OBSTACLE_IMAGES.length)];

    entities[`obstacle_${id}`] = {
      x,
      y: 0,
      source: randomImage,
      renderer: ({ x, y, source }) => <Obstacle x={x} y={y} source={source} />,
    };
  }

  const timeSinceLastPowerUp = now - entities.lastPowerUpTime;

  if (timeSinceLastPowerUp > 8000 && Math.random() < 0.5) {
    const id = entities.nextPowerUpId++;
    const x = Math.random() * (width - POWERUP_SIZE);
    const types = ["shield", "slow"];
    const type = types[Math.floor(Math.random() * types.length)];

    entities[`powerup_${id}`] = {
      x,
      y: 0,
      type,
      source: POWERUP_IMAGES[type],
      renderer: ({ x, y, source }) => <PowerUp x={x} y={y} source={source} />,
    };

    entities.lastPowerUpTime = now;
  }

  // Update survival time and score
  entities.timeSurvived += dt / 1000;
  entities.scoreText.text = `${entities.timeSurvived.toFixed(1)}s`;
  // Update display state
  entities.powerUpDisplay.shield = entities.powerUpState.shield;
  entities.powerUpDisplay.slowUntil = entities.powerUpState.slowUntil;

  return entities;
};

const getInitialEntities = () => ({
  avatar: {
    position: { x: width / 2 },
    renderer: Avatar,
  },
  scoreText: {
    text: "0.0s",
    renderer: ({ text }) => <Text style={styles.timer}>{text}</Text>,
  },
  timeSurvived: 0,
  lastTick: performance.now(),
  nextObstacleId: 0,
  powerUpState: {
    shield: false,
    slowUntil: 0,
  },
  powerUpDisplay: {
    shield: false,
    slowUntil: 0,
    renderer: ({ shield, slowUntil }) => (
      <PowerUpDisplay shield={shield} slowUntil={slowUntil} />
    ),
  },
  nextPowerUpId: 0,
  lastPowerUpTime: performance.now(),
});

export const WhileYouWaitGame = ({ onGameOver }) => {
  const engine = useRef(null);
  const [running, setRunning] = useState(true);

  const [entities, setEntities] = useState(getInitialEntities());

  return (
    <View style={styles.fullScreen}>
      <ImageBackground
        source={
          GAME_BACKGROUNDS[Math.floor(Math.random() * OBSTACLE_IMAGES.length)]
        }
        resizeMode="cover"
        style={styles.container}
      >
        <GameEngine
          ref={engine}
          systems={[GameLoop]}
          entities={entities}
          running={running}
          onEvent={(e) => {
            if (e.type === "game-over") {
              setRunning(false);
              onGameOver(Math.floor(entities.timeSurvived));

              const newEntities = getInitialEntities();
              setEntities(newEntities);
              setTimeout(() => {
                engine.current?.swap(newEntities);
                setRunning(true); // optionally restart automatically
              }, 100);
            }
          }}
          style={{ flex: 1 }}
        />
        <AppImage
          path={"app/aqua-docs-game-logo.png"}
          width={225}
          height={200}
          style={{
            width: 225,
            height: 200,
            position: "absolute",
            top: 50,
            alignSelf: "center",
          }}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScreen: { flex: 1 },
  timer: {
    position: "absolute",
    top: 40,
    right: 20,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  powerupContainer: {
    position: "absolute",
    top: 65,
    right: 20,
    alignItems: "center",
  },

  powerupIconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  powerupIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  powerupText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 2,
  },
});
