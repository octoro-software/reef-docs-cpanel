import React from "react";
import { Grid } from "../../Grid/Grid";
import { Heading } from "../../Heading/Heading";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectDashboardSettings } from "../../../store/slices/userConfigSlice";
import { Text } from "../../Text/Text";

export const DashboardSettingsForm: React.FC = () => {
  const dashboardSettings = useAppSelector(selectDashboardSettings);

  const panelPriority = dashboardSettings?.panelPriority;

  return (
    <Grid direction="column" gap={16}>
      <Heading variant={5} weight="semiBold" style={{ color: "white" }}>
        Panel Priority
      </Heading>
      <Text style={{ color: "white" }}>
        Manage the display order of the dashboard panels.
      </Text>
    </Grid>
  );
};
