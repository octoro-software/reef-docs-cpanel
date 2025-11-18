import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Grid, Icon, Text } from "../../components";
import { useModal } from "../../hooks/useModal";

type props = {
  engagementPoints: number;
};

export const EngagementPointsCounter: React.FC<props> = ({
  engagementPoints,
}) => {
  const { openModal } = useModal();

  const handlePress = () =>
    openModal({
      type: "engagementPointsHelpModal",
      height: "medium",
      modalTitle: "Engagement Points",
    });

  if (!engagementPoints) return null;

  return (
    <TouchableOpacity onPress={handlePress}>
      <Grid direction="row" gap={4} alignItems="center">
        <Icon name="reefDocsEngagementPoints" width={32} height={32} />
        <Text weight="bold">{engagementPoints}</Text>
      </Grid>
    </TouchableOpacity>
  );
};
