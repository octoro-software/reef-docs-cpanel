import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";

import { getAppDimensions } from "../../utility/dimensions";

import { ApexDashboardPanel } from "../../components/ApexDashboardPanel/ApexDashboardPanel";
import { DashboardHeader } from "../../elements/DashboardHeader/DashboardHeader";
import {
  DashboardCarousel,
  DashboardCarouselItem,
} from "../../elements/DashboardCarousel/DashboardCarousel";
import { AquaDocsDashboardPanel } from "../../components/AquaDocsDashboardPanel/AquaDocsDashboardPanel";
import { AquaDocsDashboardStabilityPanel } from "../../components/AquaDocsDashboardStabilityPanel/AquaDocsDashboardStabilityPanel";

const { height } = getAppDimensions();

export const DashboardScreen: React.FC = () => {
  useEffect(() => {
    SystemBars.setHidden(true);
  }, []);

  return (
    <View style={styles.root}>
      <DashboardHeader />

      <DashboardCarousel>
        <DashboardCarouselItem>
          <ApexDashboardPanel />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardPanel />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel />
        </DashboardCarouselItem>
      </DashboardCarousel>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#171c2eff",
    height: height,
  },
});
