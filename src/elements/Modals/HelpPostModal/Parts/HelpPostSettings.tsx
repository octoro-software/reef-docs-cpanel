import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Button,
  CheckboxField,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

export const HelpPostSettings = ({
  handleSubmit,
  handleBack,
  loading,
  error,
  icon,
}) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [disableComments, disableNotifications] = watch([
    "disableComments",
    "disableNotifications",
  ]);

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Submit"
            error={error}
            isLoading={loading}
            variant="secondary"
            onPress={handleSubmit}
          />
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleBack(-1)}
            disabled={loading}
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title="Post Settings"
          content="Add your post preferences here."
        />

        <Grid
          direction="row"
          gap={16}
          alignItems="center"
          style={{ flexWrap: "wrap" }}
        >
          <GridItem>
            <CheckboxField
              checked={disableComments}
              onChange={(e) => setValue("disableComments", e.target.value)}
              hasError={errors?.disableComments?.message}
            />
          </GridItem>
          <GridItem flex={1}>
            <Text>Disable Comments</Text>
          </GridItem>
        </Grid>
      </Grid>
    </ModalComposition>
  );
};
