import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { View } from "react-native";

import {
  Button,
  Grid,
  GridItem,
  Text,
  TextInput,
  ModalHeader,
  ModalComposition,
  Select,
  DateSelect,
  LoadingSpinner,
} from "../../../../components";

import { INPUT_BORDER_COLOR } from "../../../../constants";
import { useDeleteDosageHistory } from "../../../../hooks/useTestHistory";
import { useModal } from "../../../../hooks/useModal";
import { ButtonWithConfirmation } from "../../../../components/ButtonWithConfirmation/ButtonWithConfirmation";

export const DosingResults = ({
  handleNextStep,
  tanks,
  loading,
  updateLoading,
  title = "Enter Results",
  content = "Enter your test results below. Ignore any fields you are not actively tracking.",
  editMode,
  recordId,
}) => {
  const { closeModal } = useModal();

  const [deleteDosage, deleteDosageLoading] = useDeleteDosageHistory();

  const {
    control,
    setValue,
    formState: { errors },
    trigger,
    watch,
    getValues,
  } = useFormContext();

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!loading && firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const { fields } = useFieldArray({ control, name: "dosageResults" });

  const handleNextStepWithValidation = async () => {
    const valid = await trigger();

    if (valid) {
      return handleNextStep();
    }
  };

  const handleDeleteDosage = async () => {
    const testId = getValues("id");

    await deleteDosage(testId, recordId);

    closeModal();
  };

  const [tankId, testResultDate] = watch(["tankId", "dosageDate"]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title={editMode ? "Update Dosages" : "Save Dosages"}
              variant="secondary"
              onPress={() => handleNextStepWithValidation()}
              isLoading={updateLoading}
            />
            {editMode && (
              <ButtonWithConfirmation
                confirmationVariant="delete"
                confirmationTitle="Are you sure ?"
                title="Remove Dosage Entries"
                variant="primary"
                onPress={handleDeleteDosage}
                isLoading={deleteDosageLoading}
              />
            )}
          </Grid>
        );
      }}
    >
      <View style={{ marginBottom: 100 }}>
        <ModalHeader
          icon="reefDocsHomeTest"
          iconWidth={48}
          iconHeight={48}
          title={title}
          content={content}
        />

        <Grid direction="row" gap={8} style={{ marginTop: 16 }}>
          <GridItem flex={1}>
            <Select
              options={tanks}
              labelKey="name"
              valueKey="id"
              title="Please Select a Tank"
              label="Please Select a Tank"
              onConfirm={(value) => setValue("tankId", value)}
              hasError={errors.tankId?.message}
              value={tankId}
            />
          </GridItem>
          <GridItem flex={1}>
            <DateSelect
              label="Test Result Date"
              onConfirm={(value) => setValue("dosageDate", value)}
              value={testResultDate}
            />
          </GridItem>
        </Grid>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LoadingSpinner width={250} />
          </View>
        ) : (
          <Grid gap={8} style={{ marginTop: 16 }}>
            {Object.entries(
              fields.reduce((acc, field, idx) => {
                const group = field?.groupName || "Other";
                if (!acc[group]) acc[group] = [];
                acc[group].push({ field, idx });
                return acc;
              }, {})
            ).map(([groupName, groupFields]) => (
              <View key={groupName}>
                <View>
                  <Text
                    weight="bold"
                    style={{
                      marginBottom: 16,
                      backgroundColor: INPUT_BORDER_COLOR,
                      paddingVertical: 4,
                      textAlign: "center",
                    }}
                  >
                    {groupName}
                  </Text>
                </View>

                {groupFields.map(({ field, idx }) => {
                  const isFirstInput = idx === 0;

                  const unitLabel =
                    field?.id === "f7867aae-2c58-41ff-b0a5-7c954aa70937"
                      ? "g"
                      : "ml";

                  return (
                    <Grid
                      direction="row"
                      alignItems="center"
                      key={field.id}
                      style={{ marginBottom: 8 }}
                    >
                      <GridItem flex={1}>
                        <Text weight="bold">{field.label}</Text>
                      </GridItem>
                      <GridItem flex={1}>
                        <TextInput
                          ref={isFirstInput ? firstInputRef : undefined}
                          control={control}
                          name={`dosageResults.${idx}.readValue`}
                          keyboardType="numeric"
                          unitLabel={unitLabel}
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
                  );
                })}
              </View>
            ))}
          </Grid>
        )}
      </View>
    </ModalComposition>
  );
};
