import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { formatDistanceToNow } from "date-fns";

import { useModal } from "../../hooks/useModal";

import { getAppDimensions } from "../../utility/dimensions";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Icon,
  RichText,
  Text,
  VideoPlayer,
} from "../../components";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../constants";
import { useUser } from "../../hooks/useAuth";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { useSharePost } from "../../hooks/useShare";
import { CarouselIndicators } from "../../components/CarouselIndicators/CarouselIndicators";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useLikePost, useSavePost } from "../../hooks/usePosts";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

import {
  selectSocialFullScreen,
  setSocialFullScreen,
} from "../../store/slices/globalSlice";

import { UrgentPill } from "./Components/UrgentPill";
import { Skeleton } from "../../components/Skeleton/Skeleton";
import VideoImage from "../../components/Icon/IconImages/icon-05.png";
import CameraImage from "../../components/Icon/IconImages/icon-04.png";
import TankImage from "../../components/Icon/IconImages/icon-03.png";
import TestImage from "../../components/Icon/IconImages/icon-30.png";

import { ButtonWithConfirmation } from "../../components/ButtonWithConfirmation/ButtonWithConfirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = getAppDimensions();

const snapInterval = width;

export interface UserPostCardProps {
  user: {
    image: string;
    displayName: string;
    userName: string;
  };
  images?: string[];
  responses?: Array<{
    id: string;
    user: {
      image: string;
      displayName: string;
      userName: string;
    };
    upVotes: number;
    tags?: Array<{ id: string; name: string }>;
  }>;
  voteOnResponseId?: string;
  content?: string;
  richTextContent?: string;
  shareTank?: boolean;
  shareTest?: boolean;
  videos?: Array<{ uri: string; thumbnail: string }>;
  id?: string;
  tags?: Array<{ id: string; name: string }>;
  created_at?: Date | string;
  classification: string;
  isVisible?: boolean;
  videoMute?: boolean;
  contentHeight?: number;
  onLongPress?: () => void;
  postId?: string;
  commentId?: string;
  visibleIndex?: number;
  postIndex?: number;
  urgent?: boolean;
  testCurrentStanding?: any;
  tankSnapshot?: any;
  handleMuteVideo?: () => void;
  postLikes?: number;
  likedByUser?: boolean;
  hasSavedPost?: boolean;
  type?: string;
  edited?: boolean;
  handleApprovePost?: (id: string) => void;
  handleRejectPost?: (id: string) => void;
  actionedBy?: string;
  status?: "Approved" | "Rejected" | "Pending";
  audience?: "reef-docs" | "fresh-docs";
  sensitiveContent?: boolean;
  alwaysShowSensitiveContent?: boolean;
}

const availableVideoHeight = 400;

const PostCard: React.FC<UserPostCardProps> = ({
  user,
  images,
  richTextContent,
  shareTank,
  shareTest,
  videos,
  id,
  created_at,
  classification,
  isVisible,
  videoMute,
  handleMuteVideo,
  commentId,
  postId,
  postIndex,
  urgent,
  postLikes = 12,
  likedByUser = false,
  hasSavedPost = false,
  type,
  edited,
  handleApprovePost,
  handleRejectPost,
  actionedBy,
  status,
  audience,
  sensitiveContent,
  alwaysShowSensitiveContent,
}) => {
  const currentUser = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [showSensitiveContentCard, setShowSensitiveContentCard] = useState(
    sensitiveContent ? (alwaysShowSensitiveContent ? false : true) : false
  );

  const { deleteParam } = useQueryParams();

  const dispatch = useAppDispatch();

  const [showVideo, setShowVideo] = useState(
    videos?.length > 0
      ? sensitiveContent
        ? alwaysShowSensitiveContent
          ? true
          : false
        : true
      : false
  );

  const { openModal, modalVisible } = useModal();

  const [sharePost] = useSharePost(id);

  const [likePost, likePostLoading] = useLikePost();

  const [savePost] = useSavePost();

  const handleSavePost = async () => await savePost(id, hasSavedPost, type);

  const activeSocialFullScreenData = useAppSelector(selectSocialFullScreen);

  const fullScreenActive =
    activeSocialFullScreenData?.data?.id === id &&
    activeSocialFullScreenData?.active === true;

  const isAuthor = currentUser?.userName === user?.userName;

  const handleProfilePress = () => {
    openModal({
      type: "socialProfileModal",
      height: "large",
      modalTitle: "Profile",
      data: {
        userName: user?.userName,
      },
    });
  };

  const handleMorePress = () =>
    openModal({
      type: "postMoreSettingsModal",
      height: "small",
      modalTitle: "More",
      data: {
        postId: id,
        isAuthor,
        postClassification: classification,
        type,
      },
    });

  const handlePostResourcePress = (resourceId: string) => {
    openModal({
      type: "postResourceModal",
      modalTitle: "Post Resources",
      height: "large",
      data: {
        postId: id,
        resourceId,
      },
    });
  };

  const handleOpenComments = (commentId: string) => {
    if (commentId) {
      deleteParam("commentId");
    }

    openModal({
      type: "postCommentsModal",
      modalTitle: "Comments",
      height: "large",
      data: {
        postId: id,
        isAuthor,
        commentId,
        type,
        classification,
      },
    });
  };

  const handleLikePost = async () => {
    if (likePostLoading) return;

    await likePost(id, type, likedByUser, postLikes);
  };

  const handleSharePost = async () => await sharePost(classification);

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset?.x;
    const index = Math.round(contentOffsetX / snapInterval);
    setCurrentIndex(index);
  };

  const buttonOptions = [
    {
      icon: "favourite",
      render: true,
      customRender: () => {
        return (
          <Grid direction="row" alignItems="center">
            <Icon
              name={"favourite"}
              strokeFill={BLACK}
              strokeWidth={2}
              width={28}
              height={28}
              solid={likedByUser}
              fill={likedByUser && REEF_DOCS_BLUE}
            />
            <Text style={{ fontSize: 12 }}>{postLikes?.toString()}</Text>
          </Grid>
        );
      },
      onPress: handleLikePost,
      onLongPress: () => {
        if (!currentUser?.isModerator) return;
        openModal({
          type: "addPostLikesModal",
          modalTitle: `Adjust Likes for ${user?.displayName}'s Post`,
          height: "small",
          data: {
            postId: id,
          },
        });
      },
    },
    {
      icon: "reefDocsTanks",
      render: shareTank,
      onPress: () =>
        openModal({
          type: "userPostShareTankModal",
          modalTitle: `${user?.displayName}'s Tank`,
          height: "large",
          data: {
            postId: id,
          },
        }),
      image: TankImage,
    },
    {
      icon: "reefDocsTesting",
      render: shareTest,
      onPress: () =>
        openModal({
          type: "userPostShareTestModal",
          modalTitle: `${user?.displayName}'s Test`,
          height: "large",
          data: {
            postId: id,
          },
        }),
      image: TestImage,
    },
    {
      icon: "reefDocsCamera", // Switch from videos to images
      render: images && images.length > 0,
      onPress: () => setShowVideo(false),
      highlight: !showVideo,
      image: CameraImage,
    },
    {
      icon: "reefDocsVideo", // Switch from videos to images
      render: videos && videos.length > 0,
      onPress: () => setShowVideo(true),
      highlight: showVideo,
      image: VideoImage,
    },
  ];

  useEffect(() => {
    if (commentId && postId) {
      if (postId === id) {
        handleOpenComments(commentId);
      }
    }
  }, [commentId, postId]);

  useEffect(() => {
    videos?.length > 0 ? setShowVideo(true) : setShowVideo(false);
    sensitiveContent
      ? alwaysShowSensitiveContent
        ? setShowSensitiveContentCard(false)
        : setShowSensitiveContentCard(true)
      : setShowSensitiveContentCard(false);
  }, [videos, alwaysShowSensitiveContent]);

  const visibleButtons = buttonOptions.filter((b) => b.render);

  const timeAgo = created_at
    ? formatDistanceToNow(new Date(created_at), {
        addSuffix: true,
      })
    : "";

  const handleMediaPress = (currentSeek) => {
    if (type !== "social") return;

    dispatch(
      setSocialFullScreen({
        active: true,
        data: {
          user,
          id,
          currentSeek,
          type,
          videos,
          richTextContent,
          shareTank,
          shareTest,
          postLikes,
          likedByUser,
        },
      })
    );
  };

  const renderMedia = images?.length > 0 || videos?.length > 0;

  const handleAcceptSensitiveContent = () => {
    setShowVideo(true);
    setShowSensitiveContentCard(false);
  };

  const handleAlwaysShowContent = async () => {
    setShowVideo(true);
    setShowSensitiveContentCard(false);
    await AsyncStorage.setItem("alwaysShowSensitiveContent", "true");
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <View>
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomWidth: 1,
            borderBottomColor: INPUT_BORDER_COLOR,
          }}
        >
          <Grid
            direction="row"
            gap={8}
            alignItems="center"
            justifyContent="space-between"
          >
            <GridItem>
              <TouchableOpacity onPress={handleProfilePress}>
                <Grid direction="row" gap={8}>
                  <AppImage
                    path={user?.image}
                    style={{ width: 32, height: 32, borderRadius: 80 }}
                    width={32}
                    height={32}
                  />
                  <GridItem>
                    <Grid direction="row" alignItems="center" gap={4}>
                      <Text weight="bold">{user?.displayName}</Text>

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
                      <Text style={{ fontSize: 12, color: REEF_DOCS_GREY }}>
                        {user?.userName}
                      </Text>
                      <Text style={{ fontSize: 10 }}>{timeAgo}</Text>
                    </Grid>
                    {type === "my-posts" && (
                      <View
                        style={{
                          width: 80,
                          justifyContent: "center",
                          backgroundColor:
                            status === "Approved"
                              ? "green"
                              : status === "Rejected"
                                ? "red"
                                : "orange",
                          alignItems: "center",
                          padding: 4,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: WHITE,
                          }}
                        >
                          {status}
                        </Text>
                      </View>
                    )}
                  </GridItem>
                </Grid>
              </TouchableOpacity>
            </GridItem>

            {urgent && <UrgentPill />}

            <TouchableOpacity onPress={handleMorePress}>
              <GridItem alignItems="flex-end">
                <Icon name="moreVert" width={32} height={32} fill={BLACK} />
              </GridItem>
            </TouchableOpacity>
          </Grid>
        </View>

        <View style={{ padding: 16 }}>
          <RichText
            showMore={true}
            charLimit={150}
            html={`<span>${richTextContent}</span>`}
            styles={{ p: { fontSize: 12 }, a: { color: REEF_DOCS_BLUE } }}
            renderersProps={{
              a: {
                onPress: (_, href) => {
                  if (href.includes("liveStock")) {
                    return handlePostResourcePress(
                      href.split("liveStock://")[1]
                    );
                  }
                },
              },
            }}
          />

          {edited && (
            <Text style={{ fontSize: 12, textAlign: "left", marginTop: 4 }}>
              Edited
            </Text>
          )}
        </View>
      </View>

      {renderMedia &&
        (showSensitiveContentCard ? (
          <View
            style={{
              alignItems: "center",
              width,
              height: availableVideoHeight,
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
          <View style={{ overflow: "hidden" }}>
            {showVideo ? (
              <VideoPlayer
                video={videos?.[0]}
                width={width}
                isVisible={isVisible}
                videoMute={videoMute}
                handleMuteVideo={handleMuteVideo}
                height={availableVideoHeight}
                modalVisible={modalVisible || fullScreenActive}
                postIndex={postIndex}
                handleMediaPress={handleMediaPress}
                fullScreenActive={fullScreenActive}
              />
            ) : (
              <Zoomable
                doubleTapScale={3}
                isSingleTapEnabled
                isDoubleTapEnabled
                isPinchEnabled={false}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  style={{ backgroundColor: "black" }}
                  onMomentumScrollEnd={handleScrollEnd}
                >
                  {images?.map((image, key) => {
                    return (
                      <AppImage
                        key={key}
                        path={image}
                        width={width}
                        height={400}
                        style={{ resizeMode: "cover" }}
                      />
                    );
                  })}
                </ScrollView>
                <View
                  style={{ position: "absolute", bottom: 20, width: "100%" }}
                >
                  <CarouselIndicators
                    total={images?.length}
                    activeIndex={currentIndex}
                  />
                </View>
              </Zoomable>
            )}
          </View>
        ))}

      <View
        style={{
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          backgroundColor: "white",
        }}
      >
        <Grid direction="row">
          {visibleButtons?.map((button, key) => {
            return (
              <GridItem
                flex={1}
                key={key}
                style={{
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={button.onPress}
                  onLongPress={button?.onLongPress && button?.onLongPress}
                >
                  <Grid
                    alignItems={
                      visibleButtons?.length > 1 ? "center" : "flex-start"
                    }
                    style={{
                      borderWidth: 1,
                      padding: 8,
                      borderRightWidth: key === visibleButtons?.length ? 0 : 1,
                      borderLeftWidth: key === 0 ? 1 : 0,
                      borderColor: INPUT_BORDER_COLOR,
                    }}
                  >
                    {button?.customRender ? (
                      button.customRender()
                    ) : button?.image ? (
                      <Image
                        source={button.image}
                        style={{ width: 28, height: 28 }}
                      />
                    ) : (
                      <Icon
                        name={button.icon}
                        strokeFill={button?.highlight ? REEF_DOCS_BLUE : BLACK}
                        strokeWidth={button?.highlight ? 5 : 2}
                        width={28}
                        height={28}
                      />
                    )}
                  </Grid>
                </TouchableOpacity>
              </GridItem>
            );
          })}
        </Grid>
        {type !== "pending-posts" ? (
          <Grid
            direction="row"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: INPUT_BORDER_COLOR,
            }}
          >
            <GridItem
              flex={1}
              style={{
                borderRadius: 8,
              }}
            >
              <TouchableOpacity onPress={handleOpenComments}>
                <Grid
                  alignItems="center"
                  gap={8}
                  direction="row"
                  justifyContent="center"
                  style={{
                    borderWidth: 1,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    padding: 8,
                    borderColor: INPUT_BORDER_COLOR,
                    backgroundColor: REEF_DOCS_BLUE,
                  }}
                >
                  <Text style={{ color: "white" }}>Comments</Text>
                </Grid>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              flex={1}
              style={{
                borderRadius: 8,
              }}
            >
              <TouchableOpacity onPress={handleSharePost}>
                <Grid
                  alignItems="center"
                  gap={8}
                  direction="row"
                  justifyContent="center"
                  style={{
                    borderWidth: 1,
                    padding: 8,
                    borderColor: INPUT_BORDER_COLOR,
                    backgroundColor: REEF_DOCS_BLUE,
                  }}
                >
                  <Text style={{ color: "white" }}>Share</Text>
                </Grid>
              </TouchableOpacity>
            </GridItem>
            <GridItem
              style={{
                borderRadius: 8,
              }}
            >
              <TouchableOpacity onPress={handleSavePost}>
                <Grid
                  alignItems="center"
                  gap={8}
                  direction="row"
                  justifyContent="center"
                  style={{
                    borderWidth: 1,
                    padding: 8,
                    borderColor: INPUT_BORDER_COLOR,
                    backgroundColor: REEF_DOCS_BLUE,
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {hasSavedPost ? "Saved" : "Save"}
                  </Text>
                </Grid>
              </TouchableOpacity>
            </GridItem>
          </Grid>
        ) : actionedBy ? (
          <Grid
            direction="row"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: INPUT_BORDER_COLOR,
            }}
          >
            <GridItem flex={1}>
              <Button
                title="Post Actioned"
                style={{
                  backgroundColor: "green",
                  padding: 8,
                  borderRadius: 0,
                }}
              />
            </GridItem>
          </Grid>
        ) : (
          <View>
            <Grid
              direction="row"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: INPUT_BORDER_COLOR,
              }}
            >
              <GridItem
                flex={1}
                style={{
                  borderRadius: 8,
                }}
              >
                <ButtonWithConfirmation
                  onPress={() => handleApprovePost(id, false)}
                  title="Approve"
                  confirmationTitle="Confirm Approve ?"
                  confirmationVariant="success"
                  style={{
                    borderRadius: 0,
                    backgroundColor: REEF_DOCS_BLUE,
                    borderWidth: 1,
                    borderColor: INPUT_BORDER_COLOR,
                    padding: 8,
                  }}
                />
              </GridItem>
              <GridItem
                flex={1}
                style={{
                  borderRadius: 8,
                }}
              >
                <ButtonWithConfirmation
                  onPress={() => handleRejectPost(id, false)}
                  title="Reject"
                  confirmationTitle="Confirm Reject ?"
                  confirmationVariant="delete"
                  style={{
                    borderRadius: 0,
                    backgroundColor: "red",
                    borderWidth: 1,
                    borderColor: INPUT_BORDER_COLOR,
                    padding: 8,
                  }}
                />
              </GridItem>
            </Grid>
            <Grid
              direction="row"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: INPUT_BORDER_COLOR,
              }}
            >
              <GridItem
                flex={1}
                style={{
                  borderRadius: 8,
                }}
              >
                <ButtonWithConfirmation
                  onPress={() => handleApprovePost(id, true)}
                  title="Approve Sensitive"
                  confirmationTitle="Confirm Approve Sensitive ?"
                  confirmationVariant="success"
                  style={{
                    borderRadius: 0,
                    backgroundColor: REEF_DOCS_BLUE,
                    borderWidth: 1,
                    borderColor: INPUT_BORDER_COLOR,
                    padding: 8,
                  }}
                />
              </GridItem>
              <GridItem
                flex={1}
                style={{
                  borderRadius: 8,
                }}
              >
                <ButtonWithConfirmation
                  onPress={() => handleRejectPost(id, true)}
                  title="Silent Reject"
                  confirmationTitle="Confirm Silent Reject ?"
                  confirmationVariant="delete"
                  style={{
                    borderRadius: 0,
                    backgroundColor: "red",
                    borderWidth: 1,
                    borderColor: INPUT_BORDER_COLOR,
                    padding: 8,
                  }}
                />
              </GridItem>
            </Grid>
            <Text style={{ padding: 16, fontWeight: "bold" }}>{audience}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const UserPostCard = React.memo(PostCard, (prevProps, nextProps) => {
  const keys = [
    "id",
    "user",
    "images",
    "videos",
    "richTextContent",
    "shareTank",
    "shareTest",
    "created_at",
    "classification",
    "videoMute",
    "isVisible",
    "contentHeight",
    "handleMuteVideo",
    "commentId",
    "postId",
    "visibleIndex",
    "postIndex",
    "postLikes",
    "likedByUser",
    "hasSavedPost",
    "type",
    "edited",
    "actionedBy",
    "handleApprovePost",
    "handleRejectPost",
    "audience",
    "alwaysShowSensitiveContent",
    "sensitiveContent",
  ];

  for (const key of keys) {
    const prev = prevProps[key];
    const next = nextProps[key];
    let isEqual;
    if (key === "user" || key === "images" || key === "videos") {
      isEqual = JSON.stringify(prev) === JSON.stringify(next);
    } else {
      isEqual = prev === next;
    }
    if (!isEqual) {
      console.log(`[UserPostCard] Prop changed: ${key}`, { prev, next });
      return false;
    }
  }

  return true;
});

export const UserPostCardSkeleton: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: 16,
      }}
    >
      <View>
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomWidth: 1,
            borderBottomColor: INPUT_BORDER_COLOR,
          }}
        >
          <Grid direction="row" gap={8} justifyContent="space-between">
            <GridItem>
              <Grid direction="row" gap={8}>
                <Skeleton style={{ width: 32, height: 32, borderRadius: 80 }} />

                <GridItem>
                  <Grid direction="row" alignItems="center" gap={4}>
                    <Skeleton style={{ height: 15, width: 200 }} />
                  </Grid>
                  <Grid direction="row" gap={8} alignItems="center">
                    <Skeleton style={{ height: 15, width: 200 }} />
                  </Grid>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem alignItems="flex-end">
              {/* <Icon name="moreVert" width={32} height={32} fill={BLACK} /> */}
            </GridItem>
          </Grid>
        </View>

        <View style={{ padding: 16 }}>
          <Skeleton marginBottom={0} />
        </View>
      </View>
      <View style={{ overflow: "hidden" }}>
        <Skeleton style={{ borderRadius: 0, height: 400 }} marginTop={0} />
      </View>

      <View
        style={{
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          backgroundColor: "white",
        }}
      >
        <Grid direction="row">
          {[{}, {}, {}]?.map((button, key) => {
            return (
              <GridItem
                flex={1}
                key={key}
                style={{
                  borderRadius: 8,
                }}
              >
                <Grid
                  alignItems={"center"}
                  style={{
                    borderWidth: 1,
                    padding: 8,

                    borderLeftWidth: key === 0 ? 1 : 0,
                    borderColor: INPUT_BORDER_COLOR,
                  }}
                >
                  <Skeleton
                    marginBottom={0}
                    marginTop={0}
                    height={30}
                    width={100}
                  />
                </Grid>
              </GridItem>
            );
          })}
        </Grid>
        <Grid
          direction="row"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: INPUT_BORDER_COLOR,
          }}
        >
          <GridItem flex={1}>
            <Skeleton
              marginBottom={0}
              marginTop={0}
              height={30}
              width={width - 32}
              style={{ borderRadius: 0 }}
            />
          </GridItem>
        </Grid>
      </View>
    </View>
  );
};
