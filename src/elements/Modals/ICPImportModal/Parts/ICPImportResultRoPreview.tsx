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

export const ICPImportResultRoPreview = ({
  handleNextStep,
  manualImport = false,
  handleBack,
  icpProvider,
  includesRo = false,
}) => {
  const elements = useElements()?.filter(
    (element) => element?.isRoElement === true
  );

  const { control, setValue, watch } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "icpResults",
  });

  useEffect(() => {
    if (manualImport) {
      setValue("icpResults", elements);
    }
  }, [manualImport]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title={"Summary"}
              onPress={() => handleNextStep()}
              variant="secondary"
            />
            {manualImport && (
              <Button
                title="Back"
                onPress={() => handleBack(-1)}
                variant="primary"
              />
            )}
          </Grid>
        );
      }}
    >
      <ModalHeader title={icpProvider?.name} image={icpProvider?.image} />

      {includesRo && (
        <Grid alignItems="center" style={{ marginTop: 16 }}>
          <Heading weight={"semiBold"} variant={6}>
            RO Water
          </Heading>
        </Grid>
      )}

      <Grid gap={8} style={{ marginTop: 16 }}>
        {fields.map((field: any, key) => {
          return (
            <Grid direction="row" alignItems="center">
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
