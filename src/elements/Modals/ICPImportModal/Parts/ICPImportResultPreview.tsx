import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  TextInput,
  ModalHeader,
  ModalComposition,
} from "../../../../components";

import { useElements } from "../../../../hooks/useTestHistory";

export const ICPImportResultPreview = ({
  handleNextStep,
  manualImport = false,
  handleBack,
  icpProvider,
  includesRo = false,
  data,
  handleSubmitPreview,
  loading,
}) => {
  const elements = useElements();

  const { control, setValue } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "icpResults",
  });

  useEffect(() => {
    if (manualImport) {
      setValue("icpResults", elements);
    }
    if (data) {
      setValue("icpResults", data);
    }
  }, [manualImport, data]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title={includesRo ? "Next" : "Import Results"}
              onPress={() =>
                includesRo ? handleNextStep() : handleSubmitPreview()
              }
              isLoading={loading}
              variant="secondary"
            />
            <Button
              title="Back"
              onPress={() => handleBack(-1)}
              variant="primary"
              disabled={loading}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader
        image={icpProvider?.image}
        title={icpProvider?.name}
        content={
          manualImport
            ? "Please enter the parameters you would like to record, ignore any fields you aren't interested in tracking."
            : "Your scanned results are below. Please check your results. To help improve this service, please provide an accuracy rating."
        }
      />

      {includesRo && (
        <Grid alignItems="center" style={{ marginTop: 16 }}>
          <Heading weight={"semiBold"} variant={6}>
            Tank Elements
          </Heading>
        </Grid>
      )}

      <Grid gap={8} style={{ marginTop: 16 }}>
        {fields.map((field: any, key) => {
          return (
            <Grid direction="row" alignItems="center" key={key}>
              <GridItem flex={1}>
                <Text>{field.label}</Text>
              </GridItem>
              <GridItem flex={1}>
                <TextInput
                  control={control}
                  name={`icpResults.${key}.readValue`}
                />
              </GridItem>
            </Grid>
          );
        })}
      </Grid>
    </ModalComposition>
  );
};
