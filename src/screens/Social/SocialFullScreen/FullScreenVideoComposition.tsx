import React, { Fragment, useState } from "react";
import { Button, Grid, GridItem, Icon, Text } from "../../../components";
import { UrgentPill } from "../../../elements/UserPostCard/Components/UrgentPill";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../../../hooks/useRedux";
import { setSocialFullScreen } from "../../../store/slices/globalSlice";
import LinearGradient from "react-native-linear-gradient";
import { FullScreenVideoPlayer } from "../../../components/VideoPlayer/FullScreenVideoPlayer";
import { FullScreenUserCard } from "../Elements/FullScreenUserCard/FullScreenUserCard";
import { FullScreenActionMenu } from "../Elements/FullScreenActionMenu/FullScreenActionMenu";
import { formatDistanceToNow } from "date-fns";
import {
  POST_CLASSIFICATION_GENERAL_HELP,
  REEF_DOCS_GREY,
  WHITE,
  Z_INDEX,
} from "../../../constants";
import { getAppDimensions } from "../../../utility/dimensions";
import { clearFullScreenPosts } from "../../../store/slices/postSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: WIDTH, height } = getAppDimensions();

const FullScreenVideoCompositionComponent = React.memo(
  ({
    createdAt,
    postData,
    isActive,
    isNextVideoHorizontal,
    isCurrentHorizontal,
    alwaysShowSensitiveContent,
    handleCheckAlwaysShowContent,
  }) => {
    const insets = useSafeAreaInsets();
    const HEIGHT = height + insets.top;
    const {
      videos,
      user,
      id,
      isAuthor,
      testCurrentStanding,
      tankSnapshot,
      richTextContent,
      postLikes,
      likedByUser,
      urgent,
      shareTank,
      shareTest,
      sensitiveContent,
    } = postData ?? {};

    const [showSensitiveContentCard, setShowSensitiveContentCard] = useState(
      sensitiveContent ? (alwaysShowSensitiveContent ? false : true) : false
    );

    const video = videos?.[0];
    const dispatch = useAppDispatch();

    const timeAgo = createdAt
      ? formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        })
      : "";

    const renderBreakers = isCurrentHorizontal || isNextVideoHorizontal;

    const handleClose = () => {
      dispatch(setSocialFullScreen({ active: false }));
      dispatch(
        clearFullScreenPosts({
          classification: POST_CLASSIFICATION_GENERAL_HELP,
          type: "full-screen-videos",
        })
      );
    };

    const handleAcceptSensitiveContent = () => {
      setShowSensitiveContentCard(false);
    };

    const handleAlwaysShowContent = async () => {
      setShowSensitiveContentCard(false);
      await AsyncStorage.setItem("alwaysShowSensitiveContent", "true");
      handleCheckAlwaysShowContent();
    };

    return (
      <View>
        <Grid
          direction="row"
          justifyContent="space-between"
          style={styles.closeButton}
        >
          <GridItem flex={1} alignItems="flex-start">
            {urgent && <UrgentPill />}
          </GridItem>
          <GridItem flex={1} alignItems="flex-end">
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" width={32} height={32} />
            </TouchableOpacity>
          </GridItem>
        </Grid>

        {renderBreakers && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 9999999,
              width: WIDTH + 100,
              height: 30,
              backgroundColor: "black",
            }}
          ></View>
        )}

        {renderBreakers && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 222,
              width: WIDTH + 100,
              height: 30,
              backgroundColor: "black",
            }}
          ></View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 1.7)"]}
          style={styles.bottomFade}
        />

        {showSensitiveContentCard ? (
          <View
            style={{
              alignItems: "center",
              width: WIDTH,
              height: height,
              backgroundColor: REEF_DOCS_GREY,
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: WHITE,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              This content is sensitive and may contain live feeding.
            </Text>
            <Button
              variant="secondary"
              title="View Content"
              onPress={handleAcceptSensitiveContent}
            />
            <Button
              title="Always Show Content"
              onPress={handleAlwaysShowContent}
            />
          </View>
        ) : (
          <FullScreenVideoPlayer
            video={video}
            width={WIDTH}
            height={HEIGHT}
            isActive={isActive}
          />
        )}

        <FullScreenUserCard
          user={user}
          timeAgo={timeAgo}
          richTextContent={richTextContent}
        />

        <FullScreenActionMenu
          user={user}
          tankSnapshot={tankSnapshot}
          testCurrentStanding={testCurrentStanding}
          id={id}
          isAuthor={isAuthor}
          postLikes={postLikes}
          likedByUser={likedByUser}
          shareTank={shareTank}
          shareTest={shareTest}
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Deep compare postData and other props
    const keys = [
      "createdAt",
      "isActive",
      "isNextVideoHorizontal",
      "isCurrentHorizontal",
    ];
    for (const key of keys) {
      if (prevProps[key] !== nextProps[key]) return false;
    }
    // Deep compare postData
    if (
      JSON.stringify(prevProps.postData) !== JSON.stringify(nextProps.postData)
    )
      return false;
    return true;
  }
);

export const FullScreenVideoComposition = FullScreenVideoCompositionComponent;

const styles = StyleSheet.create({
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: Z_INDEX.socialFullScreenBottomFade,
  },
  closeButton: {
    position: "absolute",
    top: 48,
    right: 16,
    left: 16,
    zIndex: Z_INDEX.socialFullScreenCloseButton,
  },
});
