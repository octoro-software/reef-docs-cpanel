import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SystemBars } from "react-native-edge-to-edge";
import { getAppDimensions } from "../utility/dimensions";
import { Grid, GridItem, Heading, Text } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "../components/LineChart";
import { WHITE } from "../constants";
import { TestHistoryChart } from "../components/TestHistoryChart/TestHistoryChart";
import { useLocation } from "react-router-native";

const { height } = getAppDimensions();

export const ElementScreen: React.FC = () => {
  useEffect(() => {
    SystemBars.setHidden(true);
  }, []);

  const { state } = useLocation();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#020617", "#020720", "#000814"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bgGradient}
      >
        <TestHistoryChart
          elementId={state?.elementId}
          tankId={"691cc5b55ab0add9b30f0412"}
          elementName={state?.label}
          measurementUnit={"ppm"}
          activeTab={"Dosindg"}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#171c2eff",
    height: height,
  },
  bgGradient: {
    flex: 1,
    padding: 20,
    position: "relative",
  },

  card: {
    flex: 1,
    borderRadius: 28,
    padding: 1, // for a tiny “stroke” effect
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 16,
    height: 300,
  },
  cardInner: {
    flex: 1,
    borderRadius: 26,
    padding: 16,
    backgroundColor: "rgba(16, 24, 44, 0.95)", // slightly lighter than bg
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)", // subtle border
    height: 150,
    position: "relative",
  },

  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: 0,
    right: 0,
    backgroundColor: "#60a5fa33",
    opacity: 0.5,
  },
  dragHandle: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },
});

const Card = ({ children, onDragStart, onDragEnter, onDragEnd }) => {
  // Use pointer events for drag logic
  return (
    <View
      style={styles.cardInner}
      onPointerUp={onDragEnd}
      onPointerEnter={onDragEnter}
    >
      <View style={styles.dragHandle} onPointerDown={onDragStart}>
        <MaterialIcons name="drag-handle" size={24} color="#94a3b8" />
      </View>
      {children}
    </View>
  );
};
