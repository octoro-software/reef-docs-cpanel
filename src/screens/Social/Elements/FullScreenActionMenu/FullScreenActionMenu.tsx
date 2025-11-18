import React from "react";
import { Grid, GridItem, Icon, Text } from "../../../../components";
import { Image, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useModal } from "../../../../hooks/useModal";
import {
  BLACK,
  POST_CLASSIFICATION_GENERAL_HELP,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../constants";
import { useLikePost } from "../../../../hooks/usePosts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";


import CommentsImage from "../../../../components/Icon/IconImages/icon-89-white.png";
import TankImage from "../../../../components/Icon/IconImages/icon-03-white.png";
import TestImage from "../../../../components/Icon/IconImages/icon-30-white.png";
import { selectSocialFullScreenVideoMute, setVideoFullScreenMute } from "../../../../store/slices/userConfigSlice";

export const FullScreenActionMenu = ({
  id,
  isAuthor,
  tankSnapshot,
  user,
  testCurrentStanding,
  postLikes,
  likedByUser,
  shareTank,
  shareTest,
}) => {
  const { openModal } = useModal();

  const dispatch = useAppDispatch();

  const [likePost, likePostLoading] = useLikePost();

  const videoMute = useAppSelector(selectSocialFullScreenVideoMute);


  const handleMorePress = () =>
    openModal({
      type: "postMoreSettingsModal",
      height: "small",
      modalTitle: "More",
      data: {
        postId: id,
        isAuthor,
        postClassification: POST_CLASSIFICATION_GENERAL_HELP,
      },
    });

  const handleCommentsPress = () =>
    openModal({
      type: "postCommentsModal",
      modalTitle: "Comments",
      height: "large",
      data: {
        postId: id,
        isAuthor,
      },
    });

  const handleTankPress = () =>
    openModal({
      type: "userPostShareTankModal",
      modalTitle: `${user?.displayName}'s Tank`,
      height: "large",
      data: {
        postId: id,
        tankSnapshot,
      },
    });

  const handleTestPress = () =>
    openModal({
      type: "userPostShareTestModal",
      modalTitle: `${user?.displayName}'s Test`,
      height: "large",
      data: {
        postId: id,
        data: testCurrentStanding,
      },
    });

  const handleMuteVideo = () => {
    dispatch(setVideoFullScreenMute(!videoMute));
  };

  const handleLikePost = async () => {
    if (likePostLoading) return;

    await likePost(id, "social", likedByUser, postLikes, true);
  };

  return (
    <Grid gap={16} direction="column" style={styles.actionCard}>
      <GridItem>
        <Grid direction="column" alignItems="center">
          <TouchableOpacity
            onPress={handleMorePress}
            style={{ marginBottom: 32 }}
          >
            <GridItem alignItems="flex-end">
              <Icon name="moreVert" width={32} height={32} fill={WHITE} />
            </GridItem>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLikePost}>
            <Icon
              name="favourite"
              width={32}
              height={32}
              solid={likedByUser}
              fill={likedByUser ? REEF_DOCS_BLUE : WHITE}
            />
            <Text style={{ fontSize: 12, color: WHITE, textAlign: "center" }}>
              {postLikes?.toString()}
            </Text>
          </TouchableOpacity>
        </Grid>
      </GridItem>
      {shareTank && (
        <GridItem>
          <TouchableOpacity onPress={handleTankPress}>
            <Image source={TankImage} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </GridItem>
      )}
      {shareTest && (
        <GridItem>
          <TouchableOpacity onPress={handleTestPress}>
            <Image source={TestImage} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </GridItem>
      )}
      <GridItem>
        <TouchableOpacity onPress={handleCommentsPress}>
          <Image source={CommentsImage} style={{ width: 32, height: 32 }} />
        </TouchableOpacity>
      </GridItem>
      <GridItem style={{ marginTop: 32 }}>
        <TouchableOpacity onPress={handleMuteVideo}>
          <Icon
            name={videoMute ? "volumeOff" : "volume"}
            width={28}
            height={28}
            fill="white"
            strokeFill="white"
            strokeWidth={4}
          />
        </TouchableOpacity>
      </GridItem>
    </Grid>
  );
};

const styles = StyleSheet.create({
  actionCard: {
    position: "absolute",
    bottom: 240,
    right: 16,
    zIndex: 100,
    height: 200,
  },
});
