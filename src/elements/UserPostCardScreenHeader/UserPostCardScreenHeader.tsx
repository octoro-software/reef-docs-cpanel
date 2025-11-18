import React from "react";
import { TouchableOpacity } from "react-native";

import {
  Grid,
  GridItem,
  Heading,
  Icon,
  IconDefinitions,
} from "../../components";

import { BLACK, REEF_DOCS_BLUE } from "../../constants";

import { useNavigate } from "react-router-native";

type props = {
  title: string;
  onHelpPress?: () => void;
  progress?: number;
  icon?: IconDefinitions;
  onHelpPressIcon?: IconDefinitions;
  betaText?: string;
  onSecondaryPressIcon?: IconDefinitions;
  onSecondaryPress?: () => void;
};

export const UserPostCardScreenHeader: React.FC<props> = ({
  title,
  onHelpPress,
  onHelpPressIcon = "reefDocsHelp",
  icon,
  betaText,
  onSecondaryPress,
  onSecondaryPressIcon,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        style={{
          backgroundColor: "white",
          padding: 8,
          borderRadius: 8,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <GridItem flex={1}>
          <TouchableOpacity onPress={() => navigate(-1)}>
            <Icon name="chevronLeft" fill={BLACK} />
          </TouchableOpacity>
        </GridItem>
        <GridItem flex={1}>
          <Grid
            direction="row"
            gap={8}
            justifyContent="center"
            alignItems="center"
          >
            <Icon name={icon} width={24} height={24} />
            <Heading style={{ marginTop: 4 }} variant={5} weight="semiBold">
              {title}
            </Heading>
            {betaText && (
              <Heading
                variant={5}
                weight="semiBold"
                style={{ color: REEF_DOCS_BLUE, marginTop: 4 }}
              >
                {betaText}
              </Heading>
            )}
          </Grid>
        </GridItem>
        <GridItem flex={1}>
          <Grid direction="row" gap={8} justifyContent="flex-end">
            {onSecondaryPress && (
              <TouchableOpacity
                onPress={onSecondaryPress}
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={onSecondaryPressIcon}
                  width={28}
                  height={28}
                  fill={BLACK}
                />
              </TouchableOpacity>
            )}
            {onHelpPress && (
              <TouchableOpacity
                onPress={onHelpPress}
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={onHelpPressIcon}
                  width={32}
                  height={32}
                  fill={BLACK}
                />
              </TouchableOpacity>
            )}
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
};
