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
import { useDeleteTestHistory } from "../../../../hooks/useTestHistory";
import { useModal } from "../../../../hooks/useModal";
import { ButtonWithConfirmation } from "../../../../components/ButtonWithConfirmation/ButtonWithConfirmation";
import { NoDataFallbackCard } from "../../../NoDataFallbackCard/NoDataFallbackCard";

export const TestDataResults = ({
  handleNextStep,
  tanks,
  loading,
  editMode,
  ro,
  hasRoTank,
  handleImportFromCsv,
}) => {
  const [deleteTest, deleteTestLoading] = useDeleteTestHistory();
  const { closeModal } = useModal();

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

  const { fields } = useFieldArray({ control, name: "testResults" });

  const handleNextStepWithValidation = async () => {
    const valid = await trigger();

    if (valid) {
      return handleNextStep();
    }
  };

  const handleDeleteTest = async () => {
    const testId = getValues("id");

    await deleteTest(testId);

    closeModal();
  };

  const [tankId, testResultDate] = watch(["tankId", "testResultDate"]);

  const renderForm = ro ? (hasRoTank ? true : false) : true;

  const renderNext = ro ? (hasRoTank ? true : false) : true;

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Grid direction="row" gap={8}>
              {renderNext && (
                <GridItem flex={1}>
                  <Button
                    title="Import from CSV"
                    variant="primary"
                    onPress={() => handleImportFromCsv()}
                  />
                </GridItem>
              )}
              {renderNext && (
                <GridItem flex={1}>
                  <Button
                    title="Next"
                    variant="secondary"
                    onPress={() => handleNextStepWithValidation()}
                  />
                </GridItem>
              )}
            </Grid>
            {editMode && (
              <ButtonWithConfirmation
                confirmationVariant="delete"
                confirmationTitle="Are you sure ?"
                title="Remove Test"
                variant="primary"
                onPress={handleDeleteTest}
                isLoading={deleteTestLoading}
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
          title="Enter Results"
          content="Enter your test results below. Ignore any fields you are not actively tracking."
        />

        {renderForm ? (
          <>
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
                  onConfirm={(value) => setValue("testResultDate", value)}
                  value={testResultDate}
                />
              </GridItem>
            </Grid>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
                ).map(([groupName, groupFields]) => {
                  const filteredFields = ro
                    ? groupFields.filter(({ field }) => field.isRoElement)
                    : groupFields;

                  if (filteredFields.length === 0) return null;

                  return (
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

                      {filteredFields.map(({ field, idx }) => {
                        const isFirstInput = idx === 0;

                        return (
                          <Grid
                            direction="row"
                            alignItems="center"
                            key={field.id}
                            style={{ marginBottom: 8 }}
                          >
                            <GridItem flex={1}>
                              <Text weight="bold">{field.label}</Text>
                              <Text>{field.unit}</Text>
                            </GridItem>
                            <GridItem flex={1}>
                              <TextInput
                                ref={isFirstInput ? firstInputRef : undefined}
                                control={control}
                                name={`testResults.${idx}.readValue`}
                                keyboardType="numeric"
                                rules={{
                                  pattern: {
                                    value: /^\d*\.?\d+$/,
                                    message:
                                      "Please enter a valid decimal number",
                                  },
                                }}
                                transformFn={(value) => value.replace(",", ".")}
                              />
                            </GridItem>
                          </Grid>
                        );
                      })}
                    </View>
                  );
                })}
              </Grid>
            )}
          </>
        ) : (
          <NoDataFallbackCard
            title="No Applicable Tank"
            icon="reefDocsIcpTest"
            description="An RO Test Requires an RO Tank to be setup. Please add an RO tank first then come back to this screen."
            centered
          />
        )}
      </View>
    </ModalComposition>
  );
};
