import React, { useEffect, useState, useRef } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SystemBars } from "react-native-edge-to-edge";
import { getAppDimensions } from "../utility/dimensions";
import { Grid, GridItem, Heading, Icon, Text } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "../components/LineChart";
import { WHITE } from "../constants";
import { useNavigate } from "react-router-native";
const { height, width } = getAppDimensions();

const initialData = [
  {
    label: "Calcium",
    value: 562,
    change: -20,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e24f",
  },
  {
    label: "Magnesium",
    value: 1542,
    change: +42,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e252",
  },
  {
    label: "Alkalinity",
    value: 8.6,
    change: -0.2,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e246",
  },
  {
    label: "Nitrate",
    value: 22.1,
    change: -0.2,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e268",
  },
  {
    label: "Phosphate",
    value: 0.1,
    change: +0.5,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e26c",
  },
  {
    label: "Salinity",
    value: 1.026,
    change: 0,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e24b",
  },
  {
    label: "pH",
    value: 7.8,
    change: 0,
    history: [562, 540, 580, 570, 590, 600],
    elementId: "678150bf2366748b5678e247",
  },
  {
    label: "Temperature",
    value: 22.8,
    change: -1.5,
    history: [562, 540, 580, 570, 590, 25],
    elementId: "6791129bac607b3f716e0300",
  },
  {
    label: "ORP",
    value: 22.8,
    change: -1.5,
    history: [562, 540, 580, 570, 590, 25],
  },
];

export const HomeScreen: React.FC = () => {
  const [cards, setCards] = useState(initialData);
  const draggingIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    SystemBars.setHidden(true);
  }, []);

  // Drag logic scaffold
  const onDragStart = (idx: number) => {
    draggingIdx.current = idx;
  };
  const onDragEnter = (idx: number) => {
    dragOverIdx.current = idx;
  };
  const onDragEnd = () => {
    if (
      draggingIdx.current !== null &&
      dragOverIdx.current !== null &&
      draggingIdx.current !== dragOverIdx.current
    ) {
      const newCards = [...cards];
      const [removed] = newCards.splice(draggingIdx.current, 1);
      newCards.splice(dragOverIdx.current, 0, removed);
      setCards(newCards);
    }
    draggingIdx.current = null;
    dragOverIdx.current = null;
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#020617", "#020720", "#000814"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bgGradient}
      >
        <View style={styles.glow} />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ width: width - 40 }}>
            <Grid direction="column" gap={16}>
              <Grid direction="row" justifyContent="space-between">
                <Heading
                  variant={5}
                  weight="semiBold"
                  style={{ color: "white" }}
                >
                  Marty's Reef
                </Heading>
                <TouchableOpacity onPress={() => navigate("/settings")}>
                  <Icon name="settings" width={24} height={24} fill={WHITE} />
                </TouchableOpacity>
              </Grid>

              {Array.from({ length: Math.ceil(cards.length / 3) }).map(
                (_, rowIdx) => (
                  <Grid direction="row" gap={16} key={rowIdx}>
                    {cards
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((item, index) => {
                        const cardIdx = rowIdx * 3 + index;
                        return (
                          <Card
                            key={cardIdx}
                            onDragStart={() => onDragStart(cardIdx)}
                            onDragEnter={() => onDragEnter(cardIdx)}
                            onDragEnd={onDragEnd}
                            handleOnPress={() =>
                              navigate("/element", {
                                state: {
                                  ...item,
                                },
                              })
                            }
                          >
                            <Heading
                              style={{ color: WHITE }}
                              variant={5}
                              weight="semiBold"
                            >
                              {item.label}
                            </Heading>
                            <Grid
                              direction="row"
                              justifyContent="space-between"
                            >
                              <GridItem>
                                <Text
                                  style={{
                                    color: "white",
                                    fontSize: 32,
                                    fontWeight: "thin",
                                  }}
                                >
                                  {String(item.value)}
                                </Text>
                                <Text
                                  style={{
                                    color: item.change < 0 ? "red" : "green",
                                  }}
                                >
                                  {(item.change < 0 ? "" : "+") +
                                    String(item.change)}
                                </Text>
                              </GridItem>
                              <GridItem>
                                <LineChart
                                  data={item.history}
                                  width={120}
                                  height={48}
                                  color={
                                    item.change < 0 ? "#ef4444" : "#60a5fa"
                                  }
                                />
                              </GridItem>
                            </Grid>
                          </Card>
                        );
                      })}
                  </Grid>
                )
              )}
            </Grid>
          </View>
          <View style={{ width: width - 40 }}>
            <Grid direction="column" gap={16}>
              <Grid direction="row" justifyContent="space-between">
                <Heading
                  variant={5}
                  weight="semiBold"
                  style={{ color: "white" }}
                >
                  Marty's Reef
                </Heading>

                <Icon name="settings" width={24} height={24} fill={WHITE} />
              </Grid>

              {Array.from({ length: Math.ceil(cards.length / 3) }).map(
                (_, rowIdx) => (
                  <Grid direction="row" gap={16} key={rowIdx}>
                    {cards
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((item, index) => {
                        const cardIdx = rowIdx * 3 + index;
                        return (
                          <Card
                            key={cardIdx}
                            onDragStart={() => onDragStart(cardIdx)}
                            onDragEnter={() => onDragEnter(cardIdx)}
                            onDragEnd={onDragEnd}
                            handleOnPress={() =>
                              navigate("/element", {
                                state: {
                                  ...item,
                                },
                              })
                            }
                          >
                            <Heading
                              style={{ color: WHITE }}
                              variant={5}
                              weight="semiBold"
                            >
                              {item.label}
                            </Heading>
                            <Grid
                              direction="row"
                              justifyContent="space-between"
                            >
                              <GridItem>
                                <Text
                                  style={{
                                    color: "white",
                                    fontSize: 32,
                                    fontWeight: "thin",
                                  }}
                                >
                                  {String(item.value)}
                                </Text>
                                <Text
                                  style={{
                                    color: item.change < 0 ? "red" : "green",
                                  }}
                                >
                                  {(item.change < 0 ? "" : "+") +
                                    String(item.change)}
                                </Text>
                              </GridItem>
                              <GridItem>
                                <LineChart
                                  data={item.history}
                                  width={120}
                                  height={48}
                                  color={
                                    item.change < 0 ? "#ef4444" : "#60a5fa"
                                  }
                                />
                              </GridItem>
                            </Grid>
                          </Card>
                        );
                      })}
                  </Grid>
                )
              )}
            </Grid>
          </View>
        </ScrollView>
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

const Card = ({
  children,
  onDragStart,
  onDragEnter,
  onDragEnd,
  handleOnPress,
}) => {
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

      <TouchableOpacity onPress={handleOnPress}>{children}</TouchableOpacity>
    </View>
  );
};
