import React from "react";
import { Grid } from "../Grid/Grid";
import { Icon } from "../Icon/Icon";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";

type Props = {
  title: string;
  icon: string;
  text: string;
};

export const ModalNoDataFallback: React.FC<Props> = ({ title, icon, text }) => {
  return (
    <Grid alignItems="center" gap={8}>
      <Icon name={icon} />
      <Heading weight="semiBold" variant={5}>
        {title}
      </Heading>
      <Text style={{ textAlign: "center" }}>{text}</Text>
    </Grid>
  );
};
