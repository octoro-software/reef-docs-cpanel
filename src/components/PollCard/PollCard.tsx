import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { usePostPollResponse } from "../../hooks/usePolls";

import { getAppDimensions } from "../../utility/dimensions";

import { Grid } from "../Grid/Grid";
import { Text } from "../Text/Text";
import { AppImage } from "../AppImage/AppImage";
import { PollCardOptions } from "./Parts/PollCardOptions";
import { PollCardFreeText } from "./Parts/PollCardFreeText";
import { EngagementPointsCounter } from "../../elements/EngagementPointsCounter/EngagementPointsCounter";

import { INPUT_BORDER_COLOR, WHITE } from "../../constants";

const screenWidth = getAppDimensions().width;

export const PollCard = ({
  images,
  options,
  title,
  id,
  freeTextResponse,
  engagementPoints,
}) => {
  const [postPollResponse] = usePostPollResponse();
  const [submitted, setSubmitted] = useState(false);
  const [chosenOption, setChosenOption] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    if (!Array.isArray(options)) return;

    const initialVotes = options.reduce((acc, opt) => {
      acc[opt.id] = opt.totalVotes || 0;
      return acc;
    }, {});

    setVotes(initialVotes);
  }, [options]);

  const handleSubmit = async (freeText = "") => {
    if (chosenOption && !freeText) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [chosenOption]: prevVotes[chosenOption] + 1,
      }));
    }
    setSubmitted(true);
    await postPollResponse(id, chosenOption, freeText || null);
  };

  const totalVotes = Object.values(votes).reduce((acc, val) => acc + val, 0);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <AppImage
          path={images?.[0]?.url}
          width={screenWidth - 32}
          aspectRatio={1.778}
          onPress={() => null}
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <View style={{ position: "absolute", right: 16, top: 16 }}>
          <EngagementPointsCounter engagementPoints={engagementPoints} />
        </View>
      </View>
      <View style={styles.content}>
        <Grid gap={8}>
          <Text weight="bold">{title}</Text>
          {freeTextResponse ? (
            <PollCardFreeText handleSubmit={handleSubmit} />
          ) : (
            <PollCardOptions
              votes={votes}
              totalVotes={totalVotes}
              submitted={submitted}
              chosenOption={chosenOption}
              handleSubmit={handleSubmit}
              options={options}
              setChosenOption={setChosenOption}
            />
          )}
        </Grid>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER_COLOR,
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default PollCard;
