import React, { useEffect } from "react";
import { useGetRedSeaFeed, useRedSeaEnabled } from "../../hooks/useRedSea";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../hooks/useRedux";
import { selectRedSeaData } from "../../store/slices/redSeaSlice";
import { Grid, GridItem } from "../Grid/Grid";
import { Heading } from "../Heading/Heading";
import { WHITE } from "../../constants";
import { Text } from "../Text/Text";

import redSeaLogo from "./red-sea.png";

export const RedSeaReefMat: React.FC = () => {
  const redSeaFeedEnabled = useRedSeaEnabled();

  const [getRedSeaFeed] = useGetRedSeaFeed();

  const redSeaData = useAppSelector(selectRedSeaData);

  useEffect(() => {
    getRedSeaFeed();
  }, []);

  if (!redSeaFeedEnabled) return <></>;

  const data = [
    {
      label: "Daily Average Useage",
      value: redSeaData.daily_average_usage || "N/A",
    },
    {
      label: "Days Till End of Roll",
      value: redSeaData.days_till_end_of_roll || "N/A",
    },
    {
      label: "Remaining Length",
      value: `${redSeaData.remaining_length} mm` || "N/A",
    },
  ];

  return (
    <Grid direction="row" gap={16}>
      {data?.map((item, index) => {
        return (
          <View style={styles.cardInner}>
            <View style={styles.dragHandle}>
              <MaterialIcons name="drag-handle" size={24} color="#94a3b8" />
            </View>

            <TouchableOpacity>
              <Heading style={{ color: WHITE }} variant={5} weight="semiBold">
                {item.label}
              </Heading>
              <Grid direction="row" justifyContent="space-between">
                <GridItem>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 32,
                      fontWeight: "thin",
                    }}
                  >
                    {item.value}
                  </Text>
                </GridItem>
              </Grid>
            </TouchableOpacity>

            <View
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
              }}
            >
              <Image
                source={redSeaLogo}
                width={12}
                height={12}
                style={{ width: 32, height: 32, opacity: 0.5 }}
              />
            </View>
          </View>
        );
      })}
    </Grid>
  );
};

const styles = StyleSheet.create({
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
