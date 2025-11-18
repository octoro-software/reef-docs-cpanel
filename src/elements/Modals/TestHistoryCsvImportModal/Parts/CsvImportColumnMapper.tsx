import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { useModal } from "../../../../hooks/useModal";

import { Button, Grid, GridItem, Text } from "../../../../components";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";
import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Select } from "../../../../components/Form/Select/Select";
import { useElements } from "../../../../hooks/useTestHistory";

export const CsvImportColumnMapper = ({ handleNextStep }) => {
  const {
    formState: { errors },
    watch,
    control,
    setValue,
  } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "mappings",
  });

  const { closeModal } = useModal();

  const media = watch("media");

  const elements = useElements()?.filter((e) => e.isHomeTestable);

  const options = [
    {
      label: "A",
      value: 1,
    },
    {
      label: "B",
      value: 2,
    },
    {
      label: "C",
      value: 3,
    },
    {
      label: "D",
      value: 4,
    },
    {
      label: "E",
      value: 5,
    },
    {
      label: "F",
      value: 6,
    },
    {
      label: "G",
      value: 7,
    },
    {
      label: "H",
      value: 8,
    },
    {
      label: "I",
      value: 9,
    },
    {
      label: "J",
      value: 10,
    },
    {
      label: "K",
      value: 11,
    },
    {
      label: "L",
      value: 12,
    },
    {
      label: "M",
      value: 13,
    },
    {
      label: "N",
      value: 14,
    },
    {
      label: "O",
      value: 15,
    },
    {
      label: "P",
      value: 16,
    },
    {
      label: "Q",
      value: 17,
    },
    {
      label: "R",
      value: 18,
    },
    {
      label: "S",
      value: 19,
    },
    {
      label: "T",
      value: 20,
    },
    {
      label: "U",
      value: 21,
    },
    {
      label: "V",
      value: 22,
    },
    {
      label: "W",
      value: 23,
    },
    {
      label: "X",
      value: 24,
    },
    {
      label: "Y",
      value: 25,
    },
    {
      label: "Z",
      value: 26,
    },
  ];

  useEffect(() => {
    if (elements) {
      setValue("mappings", elements);
    }
  }, []);

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button title="Next" onPress={closeModal} variant="secondary" />
          <Button
            title="Back"
            onPress={() => handleNextStep(-1)}
            variant="primary"
          />
        </Grid>
      )}
    >
      <ModalHeader content="Please choose what parameters belong to what columns. Please ignore any you are not tracking" />

      <Grid gap={8} style={{ marginTop: 16 }}>
        <Grid direction="row" alignItems="center">
          <GridItem flex={1}>
            <Text>Date</Text>
          </GridItem>
          <GridItem flex={1}>
            <Select
              labelKey="label"
              valueKey="value"
              title="Select Column"
              options={options}
            />
          </GridItem>
        </Grid>
        {fields.map((field: any, key) => {
          return (
            <Grid direction="row" alignItems="center" key={key}>
              <GridItem flex={1}>
                <Text>{field.label}</Text>
              </GridItem>
              <GridItem flex={1}>
                <Select
                  labelKey="label"
                  valueKey="value"
                  title="Select Column"
                  options={options}
                />
              </GridItem>
            </Grid>
          );
        })}
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 50,
    width: 64,
    height: 64,
    borderWidth: 1,
  },
  uploadWrapper: {
    borderStyle: "dashed",
    borderColor: REEF_DOCS_BLUE,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
  },
  subText: {
    fontSize: 12,
    textAlign: "center",
    color: REEF_DOCS_GREY,
  },
});
