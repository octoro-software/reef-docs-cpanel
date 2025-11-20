import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";

import { useGetTanks, useTankList } from "../../hooks/useTanks";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

import {
  selectActiveTankId,
  selectApexFeed,
  selectAquaDocsFeed,
  selectRedSeaFeed,
  setActiveTank,
  setActiveTankName,
  setApexFeed,
  setAquaDocsFeed,
  setRedseaFeed,
} from "../../store/slices/userConfigSlice";

import { getAppDimensions } from "../../utility/dimensions";

import { RawTextInput } from "../../components/Form/RawTextInput/RawTextInput";
import { Grid, GridItem, Heading, Select, Text } from "../../components";

import { WHITE } from "../../constants";

const { height } = getAppDimensions();

export const PanelSettingsScreen: React.FC = () => {
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

  const apexFeed = useAppSelector(selectApexFeed);

  const aquaDocsFeed = useAppSelector(selectAquaDocsFeed);

  const handleTankSelect = async (value: string) => {
    dispatch(setActiveTank(value));

    const tank = tanks?.find((t) => t.id === value);

    dispatch(setActiveTankName(tank?.name || "Unnamed Tank"));
  };

  const handleRedSeaIpChange = (value: string) => {
    dispatch(setRedseaFeed({ ipAddress: value }));
  };
  const handleRedSeaRefreshTimeChange = (value: string) => {
    dispatch(setRedseaFeed({ refreshTime: value }));
  };
  const handleApexIpChange = (value: string) => {
    dispatch(setApexFeed({ ipAddress: value }));
  };
  const handleApexRefreshTimeChange = (value: string) => {
    dispatch(setApexFeed({ refreshTime: value }));
  };

  const handleAquaDocsRefreshTimeChange = (value: string) => {
    dispatch(setAquaDocsFeed({ refreshTime: value }));
  };

  return (
    <View style={styles.root}>
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
                Aqua Docs
              </Heading>

              <RawTextInput
                label="Refresh Time ( Minutes )"
                onChange={(v) => handleAquaDocsRefreshTimeChange(v)}
                value={aquaDocsFeed?.refreshTime}
                style={{ color: WHITE }}
              />

              <Heading variant={4} weight="semiBold" style={{ color: WHITE }}>
                Red Sea
              </Heading>

              <RawTextInput
                label="IP Address ( This will be changed to a lookup )"
                onChange={(v) => handleRedSeaIpChange(v)}
                value={redSeaFeed?.ipAddress}
                style={{ color: WHITE }}
              />
              <RawTextInput
                label="Refresh Time ( Minutes )"
                onChange={(v) => handleRedSeaRefreshTimeChange(v)}
                value={redSeaFeed?.refreshTime}
                style={{ color: WHITE }}
              />
              <Heading variant={4} weight="semiBold" style={{ color: WHITE }}>
                Apex
              </Heading>

              <RawTextInput
                label="IP Address ( This will be changed to a lookup )"
                onChange={(v) => handleApexIpChange(v)}
                value={apexFeed?.ipAddress}
                style={{ color: WHITE }}
              />

              <RawTextInput
                label="Refresh Time ( Minutes )"
                onChange={(v) => handleApexRefreshTimeChange(v)}
                value={apexFeed?.refreshTime}
                style={{ color: WHITE }}
              />
            </Grid>
          )}
        </GridItem>
      </Grid>
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
});
