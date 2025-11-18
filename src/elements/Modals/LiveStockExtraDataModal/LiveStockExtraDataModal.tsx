import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Animated } from "react-native";

import {
  LoadingSpinner,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../components";

import { useLiveStockVotesForDataDefinition } from "../../../hooks/useLiveStock";
import { REEF_DOCS_BLUE } from "../../../constants";

export const LiveStockExtraDataModal = ({
  label,
  icon,
  extraData,
  id,
  definition,
  currentValue,
  notVotable,
}) => {
  const [data, setData] = useState(null);

  const [getVoteData, loading, error] = useLiveStockVotesForDataDefinition();

  const handleGetVoteData = async () => {
    const response = await getVoteData(id, definition);

    setData(response?.data?.data);
  };

  useEffect(() => {
    if (notVotable) return;
    handleGetVoteData();
  }, []);

  return (
    <ModalComposition footerFix>
      <View style={styles.wrapper}>
        <ModalHeader
          title={`${label} `}
          icon={icon}
          iconHeight={48}
          iconWidth={48}
        />

        <Text weight="bold" style={{ textAlign: "center" }}>
          {currentValue}
        </Text>

        <Text style={styles.text}>{extraData}</Text>

        {!notVotable && (
          <Fragment>
            {loading && <RenderVoteBars loading />}
            {!loading && error && (
              <View>
                <Text weight="bold" style={styles.message}>
                  Unable to retrieve vote data.
                </Text>
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                  Please check back later.
                </Text>
              </View>
            )}
            {!loading && !error && data && Object.keys(data).length > 0 && (
              <RenderVoteBars results={data} />
            )}
            {!loading && !error && data && Object.keys(data).length === 0 && (
              <View>
                <Text weight="bold" style={styles.message}>
                  No vote data available.
                </Text>
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                  No votes have been cast for the selected option yet.
                </Text>
              </View>
            )}
          </Fragment>
        )}
      </View>
    </ModalComposition>
  );
};

const RenderVoteBars = ({ results = {}, loading = false }) => {
  if (loading) {
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ marginTop: 16, textAlign: "center" }} weight="bold">
          Community Contribution Results
        </Text>

        <Text style={{ fontSize: 12, textAlign: "center" }}>
          These are the opinions of others
        </Text>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <LoadingSpinner width={200} />
        </View>
      </View>
    );
  }

  const totalVotes = Object.values(results).reduce((sum, v) => sum + v, 0);

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ marginTop: 16, textAlign: "center" }} weight="bold">
        Community Contribution Results
      </Text>

      <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 16 }}>
        These are the opinions of others
      </Text>
      {Object.entries(results).map(([label, count], idx) => {
        const percentage = (count / totalVotes) * 100;
        const widthAnim = new Animated.Value(0);

        useEffect(() => {
          Animated.timing(widthAnim, {
            toValue: percentage,
            duration: 600,
            useNativeDriver: false,
          }).start();
        }, []);

        return (
          <View key={idx} style={{ marginBottom: 16 }}>
            <Text>
              {label} ({count})
            </Text>
            <View style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.barForeground,
                  {
                    width: widthAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  text: {
    marginTop: 16,
  },
  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },

  message: {
    marginTop: 24,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },

  barForeground: {
    height: "100%",
    backgroundColor: REEF_DOCS_BLUE, // or any color you want
    borderRadius: 10,
  },
});
