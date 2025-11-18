import React, { Fragment, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE, WHITE } from "../../../constants";
import { Text } from "../../Text/Text";
import { Grid, GridItem } from "../../Grid/Grid";
import { Icon } from "../../Icon/Icon";
import { Button } from "../../Button/Button";

export const PollCardOptions = ({
  votes,
  options,
  totalVotes,
  handleSubmit,
  setChosenOption,
  chosenOption,
  submitted,
}) => {
  // 🔥 Use useRef to persist animated values
  const animatedValues = useRef(
    options.reduce((acc, opt) => {
      acc[opt.id] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    if (submitted) {
      options.forEach((opt) => {
        Animated.timing(animatedValues[opt.id], {
          toValue: votes[opt.id] / Math.max(totalVotes, 1), // Normalize
          duration: 1000,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [submitted, votes, totalVotes]);

  const handleOptionSelect = (optionId) => setChosenOption(optionId);

  return (
    <Fragment>
      {!submitted
        ? options.map((opt) => {
            const isChosen = opt.id === chosenOption;

            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  {
                    borderColor: isChosen ? REEF_DOCS_BLUE : INPUT_BORDER_COLOR,
                  },
                ]}
                onPress={() => handleOptionSelect(opt.id)}
              >
                <Grid direction="row" alignItems="center" gap={16}>
                  <GridItem>
                    <Icon
                      name={isChosen ? "radioChecked" : "radio"}
                      width={32}
                      height={32}
                      fill={REEF_DOCS_BLUE}
                    />
                  </GridItem>
                  <GridItem>
                    <Text>{opt.value}</Text>
                  </GridItem>
                </Grid>
              </TouchableOpacity>
            );
          })
        : options.map((opt) => {
            const percentage = totalVotes
              ? ((votes[opt.id] / totalVotes) * 100).toFixed(1)
              : "0.0";

            return (
              <View key={opt.id} style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  {opt.value} - {votes[opt.id]} votes ({percentage}%)
                </Text>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: animatedValues[opt.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}

      {!submitted && (
        <Button
          onPress={() => handleSubmit()}
          title={chosenOption ? "Confirm" : "Please choose an Option"}
          disabled={!chosenOption}
        />
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    borderWidth: 2,
    padding: 16,
    borderRadius: 16,
  },
  resultContainer: {
    marginVertical: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: REEF_DOCS_BLUE,
  },
});
