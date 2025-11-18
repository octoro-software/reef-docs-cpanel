import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { getAppDimensions } from "../../../utility/dimensions";

import {
  selectSocialFullScreen,
  setSocialFullScreen,
} from "../../../store/slices/globalSlice";

import { POST_CLASSIFICATION_GENERAL_HELP, Z_INDEX } from "../../../constants";
import { selectPostById, selectPosts } from "../../../store/slices/postSlice";
import { useGetVideoPosts } from "../../../hooks/usePosts";
import { FullScreenVideoComposition } from "./FullScreenVideoComposition";
import { SystemBars } from "react-native-edge-to-edge";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isEdgeToEdge } from "../../../utility/isEdgeToEdge";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = getAppDimensions();

export const SocialFullScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(true);
  const socialFullScreenData = useAppSelector(selectSocialFullScreen);

  const [alwaysShowSensitiveContent, setAlwaysShowSensitiveContent] =
    useState(false);

  const handleCheckAlwaysShowContent = async () => {
    const value = await AsyncStorage.getItem("alwaysShowSensitiveContent");
    setAlwaysShowSensitiveContent(value === "true");
  };

  // All hooks must be called before any early return
  const [getMoreData] = useGetVideoPosts(
    POST_CLASSIFICATION_GENERAL_HELP,
    "full-screen-videos",
    true
  );

  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();

  const HEIGHT = height + insets.top;

  useEffect(() => {
    if (isEdgeToEdge()) {
      SystemBars.setHidden(true);
    }

    handleCheckAlwaysShowContent();
    return () => {
      SystemBars.setHidden(false);
    };
  }, []);

  const { postPagination, posts: videoPostData } = useAppSelector(
    selectPosts(POST_CLASSIFICATION_GENERAL_HELP, "full-screen-videos")
  );

  // Track the currently visible index
  const [visibleIndex, setVisibleIndex] = useState(0);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index ?? 0);
    }
  });
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

  useEffect(() => {
    if (socialFullScreenData?.active) {
      getMoreData({
        nextPage: 1,
        startFromPost: socialFullScreenData?.data?.id,
        isFullScreenVideo: true,
      });
    }
  }, [socialFullScreenData?.active]);

  const active = socialFullScreenData?.active || false;

  const postData = useAppSelector(
    selectPostById(
      POST_CLASSIFICATION_GENERAL_HELP,
      socialFullScreenData?.data?.type,
      socialFullScreenData?.data?.id
    )
  );

  useEffect(() => {
    const handleBackPress = () => {
      dispatch(setSocialFullScreen({ ...socialFullScreenData, active: false }));
      return true;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => sub.remove();
  }, [active]);

  if (!active || !postData?.id) return null;

  // Handler to fetch next page when 1 card away from end
  const handleEndReached = () => {
    if (!isReady) return;
    setIsReady(false);
    if (
      postPagination &&
      postPagination.current_page < postPagination.last_page
    ) {
      getMoreData({
        nextPage: postPagination.current_page + 1,
        startFromPost: socialFullScreenData?.data?.id,
      });
    }
    // Re-enable swipe after a short delay (or after animation/transition)
    setTimeout(() => setIsReady(true), 500);
  };

  return (
    <View style={[styles.container, { height: HEIGHT }]}>
      {!videoPostData || videoPostData?.length === 0 ? (
        <View
          style={{ height, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="white" size="large" />
        </View>
      ) : (
        <FlashList
          data={videoPostData}
          renderItem={({ item, index }) => {
            return (
              <FullScreenVideoComposition
                postData={item}
                createdAt={item?.created_at}
                isActive={index === visibleIndex}
                alwaysShowSensitiveContent={alwaysShowSensitiveContent}
                handleCheckAlwaysShowContent={handleCheckAlwaysShowContent}
                isNextVideoHorizontal={
                  videoPostData?.[index + 1]?.videos?.[0]?.orientation ===
                  "horizontal"
                }
                isCurrentHorizontal={
                  item?.videos?.[0]?.orientation === "horizontal"
                }
              />
            );
          }}
          keyExtractor={(item) => item.id?.toString()}
          pagingEnabled
          snapToInterval={HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          bounces={false}
          getItemLayout={(_, index) => ({
            length: HEIGHT,
            offset: HEIGHT * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
          onEndReached={handleEndReached}
          onEndReachedThreshold={1}
          disableIntervalMomentum={true}
          windowSize={1}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          scrollEnabled={isReady}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "black",
    zIndex: Z_INDEX.socialFullScreenContainer,
  },
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
    top: Platform.OS === "ios" ? 48 : 16,
    right: 16,
    left: 16,
    zIndex: Z_INDEX.socialFullScreenCloseButton,
  },
});
