import React, { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  Button,
  Grid,
  GridItem,
  Text,
  TextInput,
  ModalHeader,
  ModalComposition,
  Select,
} from "../../../../components";
import { useGetActiveTank } from "../../../../hooks/useTanks";
import { useCalculateDosageForActiveTank } from "../../../../hooks/useDosage";
import { FlashList } from "@shopify/flash-list";

export const TestDataDosing = ({ handleNextStep, step }) => {
  const tank = useGetActiveTank();

  const [calculateDosage] = useCalculateDosageForActiveTank();

  const testingConfig = tank?.testingConfig;

  const { control, trigger, watch, setValue } = useFormContext();

  const handleNextStepWithValidation = async () => {
    const valid = await trigger();

    if (valid) {
      return handleNextStep();
    }
  };

  const data = watch("testResults");

  const fieldsWithValues =
    data?.map((f, index) => ({ ...f, __originalIndex: index })) || [];

  // we should check for fields with values

  // we should then check for fields that have dosing enabled

  // we should then auto fill dosage if the user has checked auto dose

  // we should leave blank manual dosing fields

  // then store the dosages in the server linked to the test

  // then display these in a new tab on the test

  // provide the ability to create reminders as well maybe from the dosing modal ?

  // provide the ability to create reminders inside the element screen itself as well

  // change graph data to show dosing history when selecting the tab.

  useEffect(() => {
    if (step !== 2) return;

    fieldsWithValues.forEach((field) => {
      const key = field.__originalIndex;
      const paramTestConfig = testingConfig[field.id];
      if (!paramTestConfig?.dosingEnabled || !field?.readValue) return;

      const dosage = calculateDosage({
        currentConcentration: field?.readValue,
        targetConcentation: paramTestConfig?.target,
        increaseVolume: paramTestConfig?.dosingExampleVolume,
        increasePerLitre: paramTestConfig?.dosingConcentrationIncreaseAmount,
        productVolume: paramTestConfig?.dosingAmount,
        maxDailyDosage: paramTestConfig?.maxDailyDosage,
        unit: paramTestConfig?.dosingAmountUnit,
      });

      if (dosage?.canDose && paramTestConfig?.autoCalculate) {
        setValue(
          `testResults.${key}.dosing.amountPerDay`,
          dosage?.mostEfficient?.max
        );
        setValue(`testResults.${key}.dosing.dosingAmountUnit`, dosage?.unit);
        setValue(
          `testResults.${key}.dosing.totalDays`,
          dosage?.mostEfficient?.daysAtMax
        );
        setValue(
          `testResults.${key}.dosing.finalDosage`,
          dosage?.mostEfficient?.finalDose
        );
      }
    });
  }, [step]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title="Next"
              variant="secondary"
              onPress={() => handleNextStepWithValidation()}
            />
            <Button
              title="Back"
              variant="primary"
              onPress={() => handleNextStep(-1)}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader
        icon="reefDocsHomeTest"
        iconWidth={48}
        iconHeight={48}
        title="Dosing"
        content="Auto dosages must be accepted otherwise will be ignored. Manual dosages must have all fields filled out otherwise will be ignored."
      />

      <FlashList
        data={fieldsWithValues}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: field }) => {
          const key = field.__originalIndex;

          const paramTestConfig = testingConfig[field.id];
          const isAuto = paramTestConfig?.autoCalculate ?? false;
          const accepted = watch(`testResults.${key}.autoAccepted`) ?? false;
          const unit = watch(`testResults.${key}.dosing.dosingAmountUnit`);

          if (!paramTestConfig?.dosingEnabled || !field?.readValue) {
            return null;
          }

          const handleAccept = () => {
            setValue(`testResults.${key}.autoAccepted`, !accepted);
          };

          return (
            <Grid direction="column" gap={8} style={{ marginBottom: 16 }}>
              <Grid direction="row" gap={8} justifyContent="space-between">
                <Grid direction="row" gap={8}>
                  <Text weight="bold">{field.label}</Text>
                  <Text>{field.unit}</Text>
                </Grid>
                <GridItem>
                  <Text weight="bold">{isAuto ? "Auto" : "Manual"}</Text>
                </GridItem>
              </Grid>

              <Grid direction="row" gap={8}>
                <TextInput
                  control={control}
                  label="Amount Per Day"
                  name={`testResults.${key}.dosing.amountPerDay`}
                  keyboardType="numeric"
                  rules={{
                    pattern: {
                      value: /^\d*\.?\d+$/,
                      message: "Please enter a valid decimal number",
                    },
                  }}
                  transformFn={(value) => value.replace(",", ".")}
                />
                <GridItem flex={1}>
                  <Select
                    options={[
                      { label: "Millilitres (ml)", value: "ml" },
                      { label: "Grams (g)", value: "grams" },
                    ]}
                    labelKey="label"
                    valueKey="value"
                    title="Dosing Unit"
                    label="Unit ( Required )"
                    value={unit}
                    onConfirm={(chosenValue) =>
                      setValue(
                        `testResults.${key}.dosing.dosingAmountUnit`,
                        chosenValue
                      )
                    }
                  />
                </GridItem>
                <TextInput
                  control={control}
                  label="Total Days"
                  name={`testResults.${key}.dosing.totalDays`}
                  keyboardType="numeric"
                  rules={{
                    pattern: {
                      value: /^\d*\.?\d+$/,
                      message: "Please enter a valid decimal number",
                    },
                  }}
                  transformFn={(value) => value.replace(",", ".")}
                />
              </Grid>

              <Grid direction="row" gap={8}>
                <GridItem flex={1}>
                  <TextInput
                    control={control}
                    label="Final Dosage"
                    name={`testResults.${key}.dosing.finalDosage`}
                    keyboardType="numeric"
                    placeholder="Leave blank if not required"
                    rules={{
                      pattern: {
                        value: /^\d*\.?\d+$/,
                        message: "Please enter a valid decimal number",
                      },
                    }}
                    transformFn={(value) => value.replace(",", ".")}
                  />
                </GridItem>
              </Grid>

              {isAuto && (
                <Grid direction="row" gap={8}>
                  <GridItem flex={1}>
                    <Button
                      title={accepted ? "Cancel" : "Accept"}
                      variant={accepted ? "delete" : "success"}
                      onPress={handleAccept}
                    />
                  </GridItem>
                </Grid>
              )}
            </Grid>
          );
        }}
      />
    </ModalComposition>
  );
};
