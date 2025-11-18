import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import * as Battery from "expo-battery";

import { throttle } from "lodash";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  useApprovePost,
  useGetPosts,
  useRejectPost,
} from "../../hooks/usePosts";

import {
  selectDiseaseIdentificationPagination,
  selectDiseaseIdentificationResults,
} from "../../store/slices/postSlice";

import { UserPostCardScreenHeader } from "../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import {
  UserPostCard,
  UserPostCardSkeleton,
} from "../../elements/UserPostCard/UserPostCard";

import {
  ALL_POST_TAG_ID,
  APP_HEADER_HEIGHT,
  POST_CLASSIFICATION_GENERAL_HELP,
} from "../../constants/global";
import { useContentHeight } from "../../hooks/useApp";
import {
  selectPostTags,
  selectVideoMute,
  setPostTags,
  setVideoMute,
} from "../../store/slices/userConfigSlice";
import { NoDataFallbackCard } from "../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  selectPostAcceptedTerms,
  selectScrollDirection,
  setScrollDirection,
} from "../../store/slices/globalSlice";
import { useModal } from "../../hooks/useModal";
import { selectStructuredConfigurationById } from "../../store/slices/structuredConfigurationSlice";
import { PostTagSlider } from "../../elements/PostTagSlider/PostTagSlider";
import { PostTagLiveStockHeader } from "../../elements/PostTagLiveStockHeader/PostTagLiveStockHeader";
import { REEF_DOCS_BLUE } from "../../constants";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  title: string;
  type: string;
};

const SCROLL_DIRECTION_THRESHOLD = 200;

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 55,
  minimumViewTime: 500,
};

export const SocialScreen: React.FC<Props> = ({ title, type }) => {
  const [refreshing, setRefreshing] = useState(false);

  const [alwaysShowSensitiveContent, setAlwaysShowSensitiveContent] =
    useState(false);

  const handleCheckAlwaysShowContent = async () => {
    const value = await AsyncStorage.getItem("alwaysShowSensitiveContent");
    setAlwaysShowSensitiveContent(value === "true");
  };

  const lowPowerMode = Battery.useLowPowerMode();

  const flatListRef = useRef<FlatList>(null);

  const [loading, setLoading] = useState(false);

  const postTags = useAppSelector(
    selectStructuredConfigurationById("post_tags")
  );

  const activeTagState = useAppSelector(selectPostTags);

  const activeTags = useMemo(
    () => (activeTagState?.length > 0 ? activeTagState : [ALL_POST_TAG_ID]),
    [activeTagState]
  );

  const [rejectPost] = useRejectPost();
  const [approvePost] = useApprovePost();

  const { getParam, deleteParam } = useQueryParams();

  const commentId = getParam("commentId");

  const postId = getParam("postId");

  const liveStockId = getParam("liveStockId");

  const { openModal } = useModal();

  const dispatch = useAppDispatch();

  const scrollDirection = useAppSelector(selectScrollDirection);

  const throttledDispatch = useRef(
    throttle((direction: "up" | "down") => {
      dispatch(setScrollDirection(direction));
    }, 200) // every 200ms max
  ).current;

  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  const hasAcceptedTerms = useAppSelector(selectPostAcceptedTerms);

  const onViewableItemsChanged = ({ viewableItems, ...rest }) => {
    const ids = viewableItems.map((item) => item.item.id);
    // take the highest index, default to 0 if empty

    setVisiblePostIds(ids);
  };

  const [getPosts, getPostsLoading] = useGetPosts(
    POST_CLASSIFICATION_GENERAL_HELP,
    type
  );

  const data = useAppSelector(
    selectDiseaseIdentificationResults(POST_CLASSIFICATION_GENERAL_HELP, type)
  );

  const pagination = useAppSelector(
    selectDiseaseIdentificationPagination(
      POST_CLASSIFICATION_GENERAL_HELP,
      type
    )
  );

  const hasNoResults = pagination?.current_page === pagination?.last_page;

  const scrollOffset = useRef(0);

  const handlePullToRefresh = async () => {
    setRefreshing(true);
    await handleGetPosts({ nextPage: 1 });
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const difference = currentOffset - scrollOffset.current;

    if (Math.abs(difference) < SCROLL_DIRECTION_THRESHOLD) {
      // Too small to be a real scroll – ignore
      return;
    }

    const direction = difference > 0 ? "down" : "up";

    throttledDispatch(direction); // use the throttled function to avoid dispatching too frequently

    scrollOffset.current = currentOffset;
  };

  const handleGetPosts = async ({ nextPage }) => {
    setLoading(true);
    await getPosts({ nextPage });
    setLoading(false);
  };

  const handleClearLiveStockFilter = async () => {
    deleteParam("liveStockId");
    await getPosts({ nextPage: 1, noLiveStockId: true });
  };

  const handleGetNextPosts = async () => {
    if (hasNoResults) return;

    await getPosts({
      nextPage: pagination?.current_page + 1,
    });
  };

  const videoMute = useAppSelector(selectVideoMute);

  const contentHeight = useContentHeight();

  const handleMuteVideo = React.useCallback(() => {
    dispatch(setVideoMute(!videoMute));
  }, [dispatch, videoMute]);

  useEffect(() => {
    if (liveStockId || postId) {
      handleGetPosts({ nextPage: 1 });
      try {
        flatListRef?.current?.scrollToOffset({ offset: 0, animated: false });
      } catch (error) {}
    }
  }, [liveStockId, postId]);

  useEffect(() => {
    if (!hasAcceptedTerms) {
      openModal({
        type: "socialTermsModal",
        height: "large",
        modalTitle: "Community Guidelines",
        canClose: false,
      });
    }

    handleCheckAlwaysShowContent();
  }, []);

  useEffect(() => {
    if (scrollDirection === "down") {
      dispatch(setScrollDirection("up"));
    }
  }, []);

  const handleApprovePost = React.useCallback(
    async (id: string, isSensitive: boolean) => {
      await approvePost(id, isSensitive);
    },
    []
  );

  const handleRejectPost = React.useCallback(
    async (id: string, silent: boolean) => {
      await rejectPost(id, silent);
    },
    []
  );

  const handleTagPress = (tag: any) => {
    dispatch(setPostTags(tag.id));
  };

  useEffect(() => {
    handleGetPosts({ nextPage: 1 });
  }, [activeTags]);

  return (
    <View style={{ flex: 1 }} key={type}>
      <FlashList
        renderItem={({ item, index }) => {
          return (
            <UserPostCard
              {...item}
              videoMute={videoMute}
              handleMuteVideo={handleMuteVideo}
              isVisible={
                item?.videos?.length > 0
                  ? visiblePostIds.includes(item?.id)
                  : false
              }
              contentHeight={contentHeight}
              commentId={commentId}
              postId={postId}
              postIndex={index}
              type={type}
              handleApprovePost={handleApprovePost}
              handleRejectPost={handleRejectPost}
              alwaysShowSensitiveContent={alwaysShowSensitiveContent}
            />
          );
        }}
        decelerationRate={"fast"}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        data={data}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 200 }}
        keyExtractor={(item, index) => `${item?.id.toString()}-${index}`}
        onEndReached={handleGetNextPosts}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReachedThreshold={0.5}
        maxItemsInRecyclePool={4}
        windowSize={5}
        ref={flatListRef}
        ListFooterComponent={
          getPostsLoading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator color={REEF_DOCS_BLUE} size="large" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullToRefresh}
          />
        }
        ListHeaderComponent={useMemo(() => {
          return (
            <View
              style={{
                marginBottom: 12,
                padding: 16,
                paddingBottom: 0,
                paddingTop: 12,
                marginTop: APP_HEADER_HEIGHT,
              }}
            >
              <UserPostCardScreenHeader
                title={title}
                icon="reefDocsComment"
                betaText="BETA"
                onHelpPress={() =>
                  openModal({
                    type: "feedbackModal",
                    modalTitle: "Feedback",
                    height: "large",
                    data: {
                      section: "socialMedia",
                    },
                  })
                }
                onSecondaryPress={() =>
                  openModal({
                    type: "socialHelpModal",
                    modalTitle: "Social Help",
                    height: "large",
                  })
                }
                onSecondaryPressIcon="help"
                onHelpPressIcon="bug"
              />

              <PostTagLiveStockHeader
                liveStockId={liveStockId}
                handleClearLiveStockFilter={handleClearLiveStockFilter}
              />

              <PostTagSlider
                tags={postTags}
                activeTags={activeTags}
                onTagPress={handleTagPress}
              />

              {loading && data?.length === 0 && <UserPostCardSkeleton />}

              {!loading && data?.length === 0 && (
                <NoDataFallbackCard
                  icon={"reefDocsComment"}
                  title="No Posts Yet!"
                />
              )}
            </View>
          );
        }, [
          title,
          liveStockId,
          postTags,
          activeTags,
          handleTagPress,
          loading,
          data,
          handleClearLiveStockFilter,
          lowPowerMode,
        ])}
      />
    </View>
  );
};
