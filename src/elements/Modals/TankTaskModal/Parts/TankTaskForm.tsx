import React from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, Switch } from "react-native";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
  TextInput,
  DateSelect,
} from "../../../../components";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { ButtonWithConfirmation } from "../../../../components/ButtonWithConfirmation/ButtonWithConfirmation";

export const TankTaskForm = ({
  handleSubmit,
  loading,
  error,
  editMode,
  handleRemoveTask,
  removeLoading,
  handleBack,
}) => {
  const { control, watch, setValue, trigger, formState } = useFormContext();

  const handleValidationCheck = async () => {
    const validation = await trigger();

    if (validation) {
      await handleSubmit();
    }
  };

  const [repeat, date, expires, expiresDate] = watch([
    "repeat",
    "date",
    "expires",
    "expiresDate",
  ]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title="Submit"
              variant="secondary"
              onPress={handleValidationCheck}
              isLoading={loading}
              error={error}
              errorMessage="Something went wrong"
            />
            {editMode && (
              <ButtonWithConfirmation
                title="Delete Task"
                confirmationTitle="Confirm Remove Task ?"
                variant="primary"
                confirmationVariant="delete"
                onPress={handleRemoveTask}
                isLoading={removeLoading}
                disabled={removeLoading}
              />
            )}
            {handleBack && (
              <Button
                title="Back"
                variant="secondary"
                onPress={handleBack}
                disabled={loading}
              />
            )}
          </Grid>
        );
      }}
    >
      <ModalHeader
        title={editMode ? "Edit Task" : "Create Task"}
        icon="reefDocsTasks"
        iconWidth={48}
        iconHeight={48}
        content="Notification settings can be found in the quick action wheel. They apply to all tasks."
      />

      <Grid gap={8} style={{ marginBertical: 8, paddingBottom: 16 }}>
        <TextInput control={control} name="name" label="Task Name" />
        <TextInput
          control={control}
          name="description"
          label={`Task Description`}
        />

        <DateSelect
          label="Start Task From"
          value={date}
          onConfirm={(date) => setValue("date", date)}
        />

        <Grid direction="row" gap={8} alignItems="center">
          <GridItem>
            <Switch
              thumbColor={repeat ? REEF_DOCS_BLUE : "#000"}
              onChange={() => setValue("repeat", !repeat)}
              value={repeat}
            />
          </GridItem>
          <GridItem flex={1}>
            <Text>Repeat Task</Text>
          </GridItem>
        </Grid>

        <Text style={styles.supportText}>
          Toggle this on if this task is going to occur more than once
        </Text>

        {repeat && (
          <Grid gap={8}>
            <TextInput
              control={control}
              name="repeatDays"
              label="Repeat Every (Days)"
              keyboardType="numeric"
            />

            <Text style={styles.supportText}>
              The number of days before this task is created again, for example
              if i wanted this task to repeat each week from the start date, i
              would enter 7 for 7 days.
            </Text>

            <Grid direction="row" gap={8} alignItems="center">
              <GridItem>
                <Switch
                  thumbColor={expires ? REEF_DOCS_BLUE : "#000"}
                  onChange={() => setValue("expires", !expires)}
                  value={expires}
                />
              </GridItem>
              <GridItem flex={1}>
                <Text>Task Expires</Text>
              </GridItem>
            </Grid>

            <Text style={styles.supportText}>
              Does this task expire ? Useful for tasks that are only needed for
              a period of time.
            </Text>
            {expires && (
              <Grid>
                <DateSelect
                  label="Select Expiry Date"
                  value={expiresDate}
                  onConfirm={(date) => setValue("expiresDate", date)}
                />
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  supportText: {
    fontSize: 13,
    color: REEF_DOCS_GREY,
  },
});
