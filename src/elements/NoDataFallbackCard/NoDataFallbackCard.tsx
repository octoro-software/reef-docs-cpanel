import React from "react";
import { Button, Grid, Heading, Icon, Text } from "../../components";

export const NoDataFallbackCard = ({
  onPress,
  title,
  description,
  buttonTitle,
  icon,
  centered = false,
}) => {
  return (
    <Grid
      gap={16}
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: 32 }}
    >
      <Heading variant={4} weight="semiBold">
        {title}
      </Heading>
      <Icon name={icon} />
      <Text style={centered ? { textAlign: "center" } : {}}>{description}</Text>
      {buttonTitle && (
        <Button variant="secondary" title={buttonTitle} onPress={onPress} />
      )}
    </Grid>
  );
};
