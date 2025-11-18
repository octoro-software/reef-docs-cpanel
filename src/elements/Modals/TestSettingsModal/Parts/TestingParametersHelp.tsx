import React from "react";
import { StyleSheet } from "react-native";

import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

export const TestingParametersHelp = ({ handleNextStep }) => {
  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleNextStep(-2)}
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon="reefDocsHelp"
          iconWidth={48}
          iconHeight={48}
          title="Test Settings Help"
        />
        <Text style={styles.contentText}>
          What does all this mean ? We appreciate testing can be daunting and
          settings can be overloading. We have broken down below what each part
          is.
        </Text>
        <Heading variant={5} weight="regular">
          Elements
        </Heading>
        <Text style={styles.contentText}>
          Each element is listed that can be tracked in your tank. Each element
          has two settings ICP and Home.
        </Text>
        <Text style={styles.contentText}>
          Home - A test you can perform in your home, for example you have
          purchased a test kit that allows you to perform this test.
        </Text>
        <Text style={styles.contentText}>
          ICP - A parameter that your ICP provider tests for you. Each provider
          is different. You should enable this for parameters your interested in
          tracking from your ICP provider.
        </Text>

        <Heading variant={5} weight="regular">
          Units
        </Heading>

        <Text style={styles.contentText}>
          Simply, the units your tests work in.
        </Text>

        <Heading variant={5} weight="regular">
          Targets
        </Heading>
        <Text style={styles.contentText}>
          Low Range - The lowest value in your ideal range for the element.
        </Text>
        <Text style={styles.contentText}>
          High Range - The highest value in your ideal range for the element.
        </Text>
        <Text style={styles.contentText}>Target - Your ideal target.</Text>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 12,
  },
});
