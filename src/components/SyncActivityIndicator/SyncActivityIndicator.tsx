import React from "react";
import { selectApexSyncing } from "../../store/slices/apexSlice";
import { useAppSelector } from "../../hooks/useRedux";
import { selectAquaDocsFeedSyncing } from "../../store/slices/testingSlice";
import { selectRedSeaSyncing } from "../../store/slices/redSeaSlice";
import { Grid, GridItem } from "../Grid/Grid";

import apexLogo from "../ApexDashboardPanel/apex.png";
import redSeaLogo from "../RedSeaReefMat/red-sea.png";
import aquaDocsLogo from "../../assets/icon.png";

import { ActivityIndicator, Image } from "react-native";
import { REEF_DOCS_BLUE } from "../../constants";

export const SyncActivityIndicator: React.FC = () => {
  const apexSyncing = useAppSelector(selectApexSyncing);

  const aquaDocsSyncing = useAppSelector(selectAquaDocsFeedSyncing);

  const redSeaSyncing = useAppSelector(selectRedSeaSyncing);

  return (
    <Grid direction="row" gap={8}>
      <GridItem>
        {apexSyncing && (
          <Grid direction="row" gap={16} alignItems="center">
            <Image source={apexLogo} style={{ width: 24, height: 24 }} />
            <ActivityIndicator color={"orange"} />
          </Grid>
        )}
      </GridItem>

      <GridItem>
        {aquaDocsSyncing && (
          <Grid direction="row" gap={16} alignItems="center">
            <Image source={aquaDocsLogo} style={{ width: 24, height: 24 }} />
            <ActivityIndicator color={REEF_DOCS_BLUE} />
          </Grid>
        )}
      </GridItem>
      <GridItem>
        {redSeaSyncing && (
          <Grid direction="row" gap={16} alignItems="center">
            <Image source={redSeaLogo} style={{ width: 24, height: 24 }} />
            <ActivityIndicator color={"red"} />
          </Grid>
        )}
      </GridItem>
    </Grid>
  );
};
