import React from "react";
import { Button, Grid, Icon, Text } from "../../components";
import { useAudience } from "../../hooks/useAudience";

export const LiveStockNoResultsFallback = ({ onPress }) => {
  const { isFresh } = useAudience();

  return (
    <Grid
      gap={8}
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: 8 }}
    >
      <Icon name={isFresh ? "reefDocsPlant" : "reefDocsCoral"} />
      <Text>Not found what your looking for ?</Text>
      <Button onPress={onPress} title="Request a Profile" variant="secondary" />
    </Grid>
  );
};
