import React from "react";
import { TouchableOpacity, View } from "react-native";
import { REEF_DOCS_BLUE, WHITE } from "../../constants";
import { Text } from "../Text/Text";
import { useModal } from "../../hooks/useModal";
import { useIsDemo } from "../../hooks/useAuth";
import { getEnv } from "../../utility/getEnv";
import { socialPaths } from "../../screens/Layout/Layout";
import { useLocation } from "react-router-native";

export const UpdateCheck: React.FC = () => {
  const { openModal } = useModal();

  const location = useLocation();

  const isDemo = useIsDemo();

  const handlePress = () => {
    openModal({
      type: "feedbackModal",
      modalTitle: "Feedback",
      height: "large",
    });
  };

  const isSocialPath = socialPaths.includes(location.pathname);

  return null;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          backgroundColor: REEF_DOCS_BLUE,
          position: "absolute",
        }}
      >
        <Text
          style={{
            color: WHITE,
            fontSize: 14,
            padding: 8,
            textAlign: "center",
          }}
        >
          Public Beta - Submit Feedback Here
        </Text>
      </View>
    </TouchableOpacity>
  );
};
