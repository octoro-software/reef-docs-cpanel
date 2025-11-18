import React from "react";
import {
  AppImage,
  Grid,
  GridItem,
  Icon,
  RichText,
  Text,
} from "../../../../components";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { REEF_DOCS_BLUE, REEF_DOCS_GREY, WHITE } from "../../../../constants";

export const FullScreenUserCard: React.FC<{
  user: any;
  richTextContent: string;
  timeAgo: string;
}> = ({ user, richTextContent, timeAgo }) => {
  return (
    <Grid direction="column" style={styles.userCard}>
      <GridItem flex={1} alignItems="flex-start">
        <TouchableOpacity activeOpacity={1}>
          <Grid direction="row" gap={8}>
            <AppImage
              path={user?.image}
              style={styles.avatar}
              width={32}
              height={32}
            />
            <GridItem>
              <Grid direction="row" alignItems="center" gap={4}>
                <Text weight="bold" style={styles.displayName}>
                  {user?.displayName}
                </Text>
                {user?.verifiedUser && (
                  <Icon
                    name="verifiedUser"
                    width={14}
                    height={14}
                    fill={REEF_DOCS_BLUE}
                  />
                )}
              </Grid>
              <Grid direction="row" gap={8} alignItems="center">
                <Text style={styles.username}>{user?.userName}</Text>
                <Text style={styles.timeAgo}>{timeAgo}</Text>
              </Grid>
            </GridItem>
          </Grid>
        </TouchableOpacity>
      </GridItem>
      <GridItem flex={1} alignItems="flex-start">
        <RichText
          html={`<p>${richTextContent}</p>`}
          showMore={true}
          charLimit={40}
          styles={{
            p: {
              color: WHITE,
              marginTop: 8,
              fontSize: 12,
            },
          }}
        />
      </GridItem>
    </Grid>
  );
};

const styles = StyleSheet.create({
  userCard: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 65 : 115,
    left: 16,
    right: 64,
    zIndex: 100,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 80,
  },
  displayName: {
    color: WHITE,
  },
  username: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 10,
    color: WHITE,
  },
});
