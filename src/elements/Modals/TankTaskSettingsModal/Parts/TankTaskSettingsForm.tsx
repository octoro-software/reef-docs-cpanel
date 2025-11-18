import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Switch } from "react-native";

import {
  Button,
  DateSelect,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import { REEF_DOCS_BLUE } from "../../../../constants";

export const TankTaskSettingsForm = ({ handleSubmit, loading, error }) => {
  const { control, watch, setValue, trigger } = useFormContext();
  const {
    fields: timings,
    remove: removeTiming,
    append: addTiming,
  } = useFieldArray({
    control,
    name: "timings",
  });

  const handleValidationCheck = async () => {
    const validation = await trigger();
    if (validation) {
      await handleSubmit();
    }
  };

  const [pushNotifications, emailNotifications] = watch([
    "pushNotifications",
    "emailNotifications",
  ]);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title="Submit"
              variant="secondary"
              onPress={handleValidationCheck}
              isLoading={loading}
              error={error}
              errorMessage="Something went wrong"
            />
          </Grid>
        );
      }}
    >
      <ModalHeader
        title={"Task Settings"}
        icon="reefDocsTaskSettings"
        iconWidth={48}
        iconHeight={48}
        content="Make task notifications fit with your schedule. These settings apply to all tanks."
      />

      <Grid gap={16} style={{ marginTop: 16 }}>
        {/* <Heading variant={5} weight="semiBold">
          Reports
        </Heading>
        <Grid direction="row" gap={8} alignItems="center">
          <GridItem>
            <Switch
              thumbColor={pushNotifications ? REEF_DOCS_BLUE : "#000"}
              onChange={() =>
                setValue("monthlyEmailReport", !monthlyEmailReport)
              }
              value={monthlyEmailReport}
            />
          </GridItem>
          <GridItem flex={1}>
            <Text>Monthly Email Performance Report</Text>
          </GridItem>
        </Grid> */}
        <Heading variant={5} weight="semiBold">
          Notifications
        </Heading>
        <Grid direction="row" gap={8} alignItems="center">
          <GridItem>
            <Switch
              thumbColor={pushNotifications ? REEF_DOCS_BLUE : "#000"}
              onChange={() => setValue("pushNotifications", !pushNotifications)}
              value={pushNotifications}
            />
          </GridItem>
          <GridItem flex={1}>
            <Text>Push Notifications</Text>
          </GridItem>
        </Grid>
        <Grid direction="row" gap={8} alignItems="center">
          <GridItem>
            <Switch
              thumbColor={emailNotifications ? REEF_DOCS_BLUE : "#000"}
              onChange={() =>
                setValue("emailNotifications", !emailNotifications)
              }
              value={emailNotifications}
            />
          </GridItem>
          <GridItem flex={1}>
            <Text>Email Notifications</Text>
          </GridItem>
        </Grid>

        <GridItem>
          <Heading variant={5} weight="semiBold">
            Task Timings
          </Heading>
          <Text>
            Here you can define upto 3 times during the day a summary of
            outstanding tasks will be sent to you using the chosen notification
            channels above. Please note the times are approximate and delays can
            occur
          </Text>
        </GridItem>
        <Grid gap={16}>
          {timings?.map((timing, key) => {
            // Get the value from form state using watch
            const timingValue = watch(`timings.${key}.value`);
            let parsedValue = undefined;
            if (typeof timingValue === "string") {
              const [h, m] = timingValue.split(":").map(Number);
              if (!isNaN(h) && !isNaN(m)) {
                const d = new Date();
                d.setHours(h, m, 0, 0);
                parsedValue = d;
              }
            } else if (timingValue instanceof Date) {
              parsedValue = timingValue;
            }
            return (
              <Grid key={timing.id} gap={8}>
                <DateSelect
                  mode="time"
                  onConfirm={(time, timeCustom) =>
                    setValue(`timings.${key}.value`, timeCustom)
                  }
                  minuteInterval={15}
                  value={parsedValue}
                />
                <Button
                  variant="delete"
                  title="Remove"
                  onPress={() => removeTiming(key)}
                />
              </Grid>
            );
          })}
          {timings?.length < 3 && (
            <Button
              variant="secondary"
              title="Add"
              onPress={() => addTiming({ value: new Date() })}
            />
          )}
        </Grid>
      </Grid>
    </ModalComposition>
  );
};
