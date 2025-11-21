import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";

import { getAppDimensions } from "../../utility/dimensions";

import { DashboardHeader } from "../../elements/DashboardHeader/DashboardHeader";
import {
  DashboardCarousel,
  DashboardCarouselItem,
} from "../../elements/DashboardCarousel/DashboardCarousel";
import { AquaDocsDashboardPanel } from "../../components/AquaDocsDashboardPanel/AquaDocsDashboardPanel";
import { AquaDocsDashboardStabilityPanel } from "../../components/AquaDocsDashboardStabilityPanel/AquaDocsDashboardStabilityPanel";
import { ApexDashboardPanel } from "../../components/ApexDashboardPanel/ApexDashboardPanel";
import BootSplash from "react-native-bootsplash";

const { height } = getAppDimensions();

export const DashboardScreen: React.FC = () => {
  useEffect(() => {
    SystemBars.setHidden(true);
    SystemBars.setStyle("dark");
    BootSplash.hide();
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
          <AquaDocsDashboardStabilityPanel description="How consistent a parameter stays relative to its average value." />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Range"
            type="rangeStability"
            description="How wide the highest and lowest readings spread over time. A tight range means the parameter stays within a narrow band (good stability), while a wide range shows big jumps."
            disablePercentage
          />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Target Centered"
            type="targetCenteredStability"
            description="How closely a parameter clusters around your chosen ideal “target” value. Even if the number fluctuates, stability is high if readings stay near your preferred set point. Great for alkalinity and calcium management."
          />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Tolerance Band"
            type="toleranceBandStability"
            description="How often a parameter stays within a specific acceptable window (e.g., ±0.2 dKH, ±0.1 salinity).
The more time spent inside that safe band, the more stable the tank is. Useful for corals that need tight conditions."
          />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Mad Stability"
            type="madStability"
            disablePercentage
            description="The average size of deviations from the parameter’s normal value.
Small average deviations = strong stability. This metric softens the impact of rare spikes and gives a realistic sense of day-to-day stability."
          />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Swing Frequency"
            type="swingFrequencyStability"
            disablePercentage
            description="How often the parameter shifts direction (up → down → up).
Frequent swings, even if small, are stressful for livestock. Fewer swings mean steadier, calmer conditions."
          />
        </DashboardCarouselItem>
        <DashboardCarouselItem>
          <AquaDocsDashboardStabilityPanel
            title="Drift Stability"
            type="driftStability"
            disablePercentage
            description="Whether the parameter slowly moves upward or downward over time instead of staying steady."
          />
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
