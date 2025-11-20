import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

import { useAppSelector } from "../../hooks/useRedux";

import { selectActiveTankName } from "../../store/slices/userConfigSlice";

import { Grid, Heading, Icon } from "../../components";
import { SyncActivityIndicator } from "../../components/SyncActivityIndicator/SyncActivityIndicator";

import { WHITE } from "../../constants";

export const DashboardHeader: React.FC = () => {
  const tankName = useAppSelector(selectActiveTankName);

  const navigate = useNavigate();

  return (
    <Grid
      direction="row"
      justifyContent="space-between"
      style={{ padding: 20 }}
    >
      <Heading variant={5} weight="semiBold" style={{ color: "white" }}>
        {tankName}
      </Heading>
      <Grid direction="row">
        <SyncActivityIndicator />

        <TouchableOpacity onPress={() => navigate("/settings")}>
          <Icon name="settings" width={24} height={24} fill={WHITE} />
        </TouchableOpacity>
      </Grid>
    </Grid>
  );
};
