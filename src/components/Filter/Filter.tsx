import React, { useEffect, useRef } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  View,
} from "react-native";

import { Grid } from "../Grid/Grid";
import { Text } from "../Text/Text";

import { getAppDimensions } from "../../utility/dimensions";
import { Z_INDEX } from "../../constants";

const { width, height } = getAppDimensions();

type Props = {
  facets: Array<{ label: string; name: string }>;
  filterShow: boolean;
  setFilterShow: (value: boolean) => void;
};

export const Filter: React.FC<Props> = ({
  facets,
  filterShow,
  setFilterShow,
}) => {
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (filterShow) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [filterShow, slideAnim]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      <Grid style={styles.menu} justifyContent="space-between" direction="row">
        <TouchableOpacity onPress={() => setFilterShow(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text weight="semiBold" style={styles.filterText}>
          Filters
        </Text>
        <Text style={styles.resetText}>Reset</Text>
      </Grid>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Grid gap={32}>
          {facets?.map((facet, key) => (
            <></>
          ))}
        </Grid>
      </ScrollView>
      <View style={styles.scrollViewSpacer} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    zIndex: Z_INDEX.filter,
    height: height, // Set height to available screen height
    flex: 1,
    padding: 16,
  },
  scrollViewSpacer: { paddingBottom: 120 },
  menu: {
    marginBottom: 32,
  },
  cancelText: {
    color: "black",
    fontSize: 16,
  },
  filterText: {
    color: "black",
    fontSize: 18,
  },
  resetText: {
    color: "black",
    fontSize: 16,
  },
});
