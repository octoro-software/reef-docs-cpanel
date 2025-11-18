import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useModal } from "../../../hooks/useModal";
import { useGetPostTagResults } from "../../../hooks/usePosts";

import { Button, Heading, ModalComposition, Text } from "../../../components";

import { REEF_DOCS_BLUE } from "../../../constants";

export const PostTagResultsModal = ({ postId }) => {
  const { closeModal } = useModal();
  const [results, setResults] = useState([]);
  const [animatedWidths, setAnimatedWidths] = useState([]);

  const [getTagResults, tagResultsLoading] = useGetPostTagResults();

  const handleGetResults = async () => {
    const response = await getTagResults(postId);
    setResults(response || []);
  };

  useEffect(() => {
    handleGetResults();
  }, []);

  const totalVotes = results.reduce((acc, result) => acc + result.count, 0);

  // Create animated values and animate them
  useEffect(() => {
    const animations = results.map(() => new Animated.Value(0));
    setAnimatedWidths(animations);

    animations.forEach((anim, index) => {
      const percentage = (results[index]?.count / totalVotes) * 100;
      Animated.timing(anim, {
        toValue: percentage,
        duration: 600,
        useNativeDriver: false,
      }).start();
    });
  }, [results]);

  return (
    <ModalComposition
      footerFix
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <View style={styles.container}>
        <Heading style={{ textAlign: "center" }} variant={5} weight="bold">
          {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
        </Heading>
        <Text style={{ marginTop: 8, textAlign: "center" }} weight="bold">
          Community Tag Results
        </Text>

        <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 16 }}>
          These are the opinions of others
        </Text>

        {results.map((result, idx) => (
          <View key={idx} style={{ marginBottom: 16 }}>
            <Text>
              {result?.name} ({result?.count})
            </Text>
            <View style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.barForeground,
                  {
                    width: animatedWidths[idx]?.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
