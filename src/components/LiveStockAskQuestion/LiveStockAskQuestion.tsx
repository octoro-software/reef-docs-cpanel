import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../Text/Text";
import { useModal } from "../../hooks/useModal";
import {
  POST_CLASSIFICATION_GENERAL_HELP,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../constants";
import { getAppEnv } from "../../utility/environment";

export const LiveStockAskQuestion: React.FC<{
  liveStockName: string;
  liveStockId: string;
}> = ({ liveStockName, liveStockId }) => {
  const { openModal } = useModal();

  const defaultValue = `{@}[${liveStockName}](liveStock-${liveStockId}) `;

  const handleAskQuestion = () => {
    openModal({
      type: "helpPostModal",
      modalTitle: "New Post",
      height: "large",
      data: {
        classification: POST_CLASSIFICATION_GENERAL_HELP,
        icon: "reefDocsFish",
        title: `Question about ${liveStockName}`,
        description:
          "Please be detailed about your question, it will help the community assist you better and also help others who may have the same question in the future.",
        placeholder: "Type your question here",
        defaultValue,
        taggable: {
          coral: true,
          liveStock: true,
          articles: false,
          tags: true,
          users: false,
        },
      },
    });
  };

  if (getAppEnv() === "production") {
    return null; // Hide in production environment
  }

  return (
    <TouchableOpacity onPress={handleAskQuestion} style={styles.container}>
      <Text style={styles.text}>Got a Question ? Ask the community</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: REEF_DOCS_BLUE,
    padding: 8,
    borderRadius: 8,
  },
  text: {
    color: WHITE,
  },
});
