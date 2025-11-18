import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

import { Grid, Text } from "../../components";
import { PollCard } from "../../components/PollCard/PollCard";

import { useAppSelector } from "../../hooks/useRedux";
import { useGetPolls } from "../../hooks/usePolls";

import { selectPolls } from "../../store/slices/pollSlice";

import { INPUT_BORDER_COLOR } from "../../constants";

const screenWidth = getAppDimensions().width;

export const DashboardPoll = () => {
  const [getPolls] = useGetPolls();

  const pollData = useAppSelector(selectPolls);

  useEffect(() => {
    getPolls();
  }, []);

  if (!pollData?.length) return null;

  return (
    <View style={styles.container}>
      <Text weight="bold" style={{ marginBottom: 8 }}>
        Polls
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Grid direction="row" gap={16}>
          {pollData?.map((option) => (
            <View key={option.id} style={{ width: screenWidth - 32 }}>
              <PollCard
                title={option?.title}
                image={option?.image}
                options={option?.options}
                id={option?._id}
                freeTextResponse={option?.freeTextResponse}
                engagementPoints={3}
              />
            </View>
          ))}
        </Grid>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionButton: {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    padding: 16,
    borderRadius: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
  },
  voteButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  voteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
