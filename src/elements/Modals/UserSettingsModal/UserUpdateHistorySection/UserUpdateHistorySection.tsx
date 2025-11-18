import React from "react";
import { StyleSheet, View } from "react-native";

import {
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  ModalHeader,
  RichText,
  Text,
} from "../../../../components";

import { INPUT_BORDER_COLOR, REEF_DOCS_GREY } from "../../../../constants";

export const UserUpdateHistorySection = () => {
  const updateHistory = [
    {
      title: "Testing - Dosages",
      date: "24/05/2025",
      description: `<p>Added the ability to specify dosage via test settings. Open test settings, find an applicable element e.g Calcium.</p> <br/><p>Input the dosage formula from the instructions on your preferred dosing product.</p> <br /> <p>The next test where your parameter is off target a dosage will be calculated for you with the ability to auto create tasks.</p> `,
    },
  ];

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Update History"
            icon="reefDocsServerChange"
            iconWidth={48}
            iconHeight={48}
          />

          {updateHistory.map((item, index) => (
            <GridItem
              key={index}
              style={
                index === 0
                  ? {
                      paddingBottom: 8,
                    }
                  : {
                      borderTopWidth: 1,
                      borderTopColor: INPUT_BORDER_COLOR,
                      paddingTop: 16,
                      paddingBottom: 8,
                    }
              }
            >
              <Heading variant={5} weight="semiBold">
                {item?.title}
              </Heading>
              <Text style={{ color: REEF_DOCS_GREY, marginBottom: 4 }}>
                {item?.date}
              </Text>
              <RichText html={item?.description} />
            </GridItem>
          ))}
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});
