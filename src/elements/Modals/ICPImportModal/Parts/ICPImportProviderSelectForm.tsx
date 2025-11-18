import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Button,
  ModalHeader,
  Grid,
  ModalComposition,
  Select,
} from "../../../../components";

import { generatePastDates } from "../../../../utility/date";

export const ICPImportProviderSelect = ({
  handleManualImport,
  handleVideoImport,
  icpProvider,
  handleConfirmProvider,
  icpProviders,
  tanks,
}) => {
  const {
    control,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext();

  const [tankId, providerId] = watch(["tankId", "providerId"]);

  const handleValidationCheck = async (fn) => {
    const validation = await trigger([
      "tankId",
      "providerId",
      "testTypeId",
      "testSentDate",
      "testResultDate",
    ]);
    if (validation) {
      fn();
    }
  };

  const handleConfirmTestType = (value: string) =>
    setValue("testTypeId", value);

  const dateOptions = generatePastDates(365);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title="Video Import"
              variant="secondary"
              onPress={() => handleValidationCheck(handleVideoImport)}
            />
            <Button
              title="Manual Import"
              variant="primary"
              onPress={() => handleValidationCheck(handleManualImport)}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader title={icpProvider?.name} image={icpProvider?.image} />

      <Grid gap={8} style={{ marginTop: 8 }}>
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
        <Select
          options={icpProviders ?? []}
          labelKey="name"
          valueKey="id"
          title="Please Select a Provider"
          label="Please Select a Provider"
          onConfirm={handleConfirmProvider}
          hasError={errors.providerId?.message}
          value={providerId}
        />

        {icpProvider && (
          <Select
            label="Test Type"
            options={icpProvider?.products ?? []}
            labelKey="name"
            valueKey="id"
            title={`${icpProvider?.name} Test Type`}
            onConfirm={handleConfirmTestType}
            hasError={errors.testTypeId?.message}
          />
        )}

        <Select
          control={control}
          name="testSentDate"
          label="Test Sent Date"
          options={dateOptions}
          labelKey="label"
          valueKey="value"
          title="Please Choose a Date"
          onConfirm={(value) => setValue("testSentDate", value)}
          hasError={errors.testSentDate?.message}
        />

        <Select
          control={control}
          name="testResultDate"
          label="Test Result Date"
          options={dateOptions}
          labelKey="label"
          valueKey="value"
          title="Please Choose a Date"
          onConfirm={(value) => setValue("testResultDate", value)}
          hasError={errors.testResultDate?.message}
        />
      </Grid>
    </ModalComposition>
  );
};
