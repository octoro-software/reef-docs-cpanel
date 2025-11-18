import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Grid, GridItem } from "../Grid/Grid";
import { Icon } from "../Icon/Icon";
import { Text } from "../Text/Text";

import { BLACK } from "../../constants";

type Props = {
  text: string;
  tipId: string;
  style?: object;
};

export const AppTip: React.FC<Props> = ({ text, tipId, style }) => {
  const [render, setRender] = useState(false);

  const hasDismissedTip = async () => {
    const tipDismissed = await AsyncStorage.getItem(tipId);

    if (tipDismissed) {
      setRender(false);
    } else {
      setRender(true);
    }
  };

  const handleDismissTip = async () => {
    await AsyncStorage.setItem(tipId, "dismissed");
    setRender(false);
  };

  useEffect(() => {
    hasDismissedTip();
  }, []);

  if (!render) return null;

  return (
    <Grid style={[styles.wrapper, style]}>
      <Grid direction="row" gap={16}>
        <Icon name="reefDocsArticles" />
        <GridItem flex={1}>
          <Text weight="semiBold" style={styles.tipText}>
            {text}
          </Text>
        </GridItem>
        <TouchableOpacity onPress={handleDismissTip}>
          <Icon name="close" fill={BLACK} />
        </TouchableOpacity>
      </Grid>
    </Grid>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fbc666",
    padding: 8,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 12,
  },
});
