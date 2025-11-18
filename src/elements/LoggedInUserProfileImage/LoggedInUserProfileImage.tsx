import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppImage } from "../../components/AppImage/AppImage";
import { useModal } from "../../hooks/useModal";
import { useUser } from "../../hooks/useAuth";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../constants";

type Props = {
  disableOnPress?: boolean;
  setShowAddMenu?: (show: boolean) => void;
  width?: number;
  height?: number;
};

export const LoggedInUserProfileImage: React.FC<Props> = ({
  disableOnPress = false,
  setShowAddMenu,
  width = 32,
  height = 32,
}) => {
  const user = useUser();

  const { openModal } = useModal();

  const handlePress = () => {
    setShowAddMenu(false);
    openModal({
      type: "userSettingsModal",
      modalTitle: "Settings",
      height: "large",
    });
  };

  return (
    <View>
      <TouchableOpacity disabled={disableOnPress} onPress={handlePress}>
        <AppImage
          path={user?.image}
          width={width}
          height={height}
          style={
            user?.subscribed
              ? [
                  styles.profile,
                  {
                    borderWidth: 3,
                    borderRadius: 100,
                    borderColor: REEF_DOCS_BLUE,
                  },
                ]
              : user?.postBan
              ? {
                  borderWidth: 2,
                  borderRadius: 100,
                  borderColor: "#fbc666",
                }
              : styles.profile
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    borderRadius: 100,
    borderColor: REEF_DOCS_GREY,
    borderWidth: 1,
    width: 48,
    height: 48,
  },
});
