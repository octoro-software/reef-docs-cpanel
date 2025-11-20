import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SystemBars } from "react-native-edge-to-edge";
import { getAppDimensions } from "../utility/dimensions";
import { Grid, GridItem, Heading, Select, Text } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { WHITE } from "../constants";
import { useGetTanks, useTankList } from "../hooks/useTanks";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  selectActiveTankId,
  selectActiveTankName,
  selectRedSeaFeed,
  setActiveTank,
  setRedseaFeed,
} from "../store/slices/userConfigSlice";
import { RawTextInput } from "../components/Form/RawTextInput/RawTextInput";
const { height } = getAppDimensions();

export const SettingsScreen: React.FC = () => {
  const tanks = useTankList();

  const [getTanks] = useGetTanks();

  const dispatch = useAppDispatch();

  useEffect(() => {
    getTanks();
  }, []);

  const [activeMenu, setActiveMenu] = useState("tank");

  useEffect(() => {
    SystemBars.setHidden(true);
  }, []);

  const activeTank = useAppSelector(selectActiveTankId);

  const redSeaFeed = useAppSelector(selectRedSeaFeed);

  console.log(redSeaFeed);

  const handleTankSelect = async (value: string) => {
    dispatch(setActiveTank(value));

    const tank = tanks?.find((t) => t.id === value);

    dispatch(selectActiveTankName(tank?.name || "Unnamed Tank"));
  };

  const handleRedSeaIpChange = (value: string) => {
    console.log(value);
    dispatch(setRedseaFeed({ ipAddress: value }));
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#020617", "#020720", "#000814"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bgGradient}
      >
        <Heading variant={5} weight="semiBold" style={{ color: "white" }}>
          Settings
        </Heading>

        <Grid direction="row" style={{ marginTop: 32 }} gap={16}>
          <GridItem
            style={{
              backgroundColor: "rgba(16, 24, 44, 0.95)",
              height: height - 32,
              minWidth: 100,
            }}
          >
            <Grid direction="column">
              {menu.map((item) => (
                <TouchableOpacity
                  onPress={() => setActiveMenu(item?.definition)}
                  key={item.definition}
                >
                  <Grid
                    direction="row"
                    gap={8}
                    style={{ marginBottom: 20, padding: 16 }}
                  >
                    <Text style={{ color: WHITE }}>{item.label}</Text>
                  </Grid>
                </TouchableOpacity>
              ))}
            </Grid>
          </GridItem>
          <GridItem
            flex={1}
            style={{
              backgroundColor: "rgba(16, 24, 44, 0.95)",
              height: height - 32,
              padding: 16,
            }}
          >
            {activeMenu === "tank" && (
              <Grid direction="column" gap={16}>
                <Select
                  options={tanks}
                  labelKey="name"
                  valueKey="id"
                  label="Active Tank"
                  onConfirm={(v) => handleTankSelect(v)}
                  title="Select Tank"
                  value={activeTank}
                />
              </Grid>
            )}
            {activeMenu === "feed" && (
              <Grid direction="column" gap={16}>
                <Heading variant={4} weight="semiBold" style={{ color: WHITE }}>
                  Red Sea
                </Heading>

                <RawTextInput
                  label="IP Address ( This will be changed to a lookup )"
                  onChange={(v) => handleRedSeaIpChange(v)}
                  value={redSeaFeed?.ipAddress}
                  style={{ color: WHITE }}
                />
              </Grid>
            )}
          </GridItem>
        </Grid>
      </LinearGradient>
    </View>
  );
};

const menu = [
  {
    label: "Tank",
    definition: "tank",
  },
  {
    label: "Feed",
    definition: "feed",
  },
];

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
