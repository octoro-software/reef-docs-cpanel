import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { getAppDimensions } from "../../utility/dimensions";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  appendNotifications,
  clearNotificationCount,
  selectNotificationMenuActive,
  selectNotifications,
  setNotificationMenuActive,
} from "../../store/slices/globalSlice";

import { NoDataFallbackCard } from "../NoDataFallbackCard/NoDataFallbackCard";
import apiClient from "../../api/apiClient";
import {
  AppImage,
  Button,
  Grid,
  Heading,
  RichText,
  Text,
} from "../../components";
import {
  APP_HEADER_HEIGHT,
  CORAL_PROFILE_PATH,
  LIVESTOCK_PROFILE_PATH,
  WHITE,
} from "../../constants";
import { getPostUrlByClassification } from "../../utility/post";
import { useLocation, useNavigate } from "react-router-native";
import { formatDistanceToNow } from "date-fns";
import { socialPaths } from "../../screens/Layout/Layout";

const { height } = getAppDimensions();

const urlResolver = (notif) => {
  if (notif?.url) {
    return notif?.url;
  }

  if (notif?.data?.postId && !notif?.data?.rejected) {
    const postUrl = getPostUrlByClassification(notif?.data?.classification);
    return ["post_comment", "post_mention"].includes(notif?.type)
      ? `${postUrl}?postId=${notif?.data?.postId}&commentId=${notif?.data?.commentId}`
      : `${postUrl}?postId=${notif?.data?.postId}`;
  }

  if (
    ["livestock_media_approval", "livestock_experience_approval"].includes(
      notif?.type
    )
  ) {
    if (notif?.data?.plantCoral) {
      return CORAL_PROFILE_PATH(notif?.data?.liveStockId);
    } else {
      return LIVESTOCK_PROFILE_PATH(notif?.data?.liveStockId);
    }
  }
  return notif?.data?.url || null;
};

export const Notifications = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const active = useAppSelector(selectNotificationMenuActive);
  const { notifications: notificationList } =
    useAppSelector(selectNotifications);

  const markAsRead = async () => {
    await apiClient.get("/notifications/read");
    dispatch(clearNotificationCount());
  };

  useEffect(() => {
    if (active) {
      markAsRead();
      setCurrentPage(1);
    }
  }, [active]);

  const hasMore = notificationList?.data?.length !== notificationList?.total;

  const loadMoreNotifications = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const response = await apiClient.get(
        `/notifications?page=${currentPage + 1}`
      );
      const newData = response?.data?.data ?? [];

      dispatch(
        appendNotifications({
          data: newData,
        })
      );

      setCurrentPage((prev) => prev + 1);
    } catch (e) {
      console.error("Load more failed", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNotificationPress = (url: string) => {
    navigate(url);
    dispatch(setNotificationMenuActive(false));
  };

  const hasNotifications = notificationList?.data?.length > 0;

  const isSocialPath = socialPaths.includes(location.pathname);

  if (!active) return null;

  return (
    <View
      style={{
        height: height,
        paddingTop: isSocialPath ? APP_HEADER_HEIGHT + 16 : 16,
        backgroundColor: "#EEF2F4",
      }}
    >
      {!hasNotifications && (
        <NoDataFallbackCard
          icon="reefDocsNotifications"
          title="All Caught Up!"
          description="You have no new notifications."
          buttonTitle="Close"
          onPress={() => dispatch(setNotificationMenuActive(false))}
        />
      )}
      {hasNotifications && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Heading weight="semiBold" variant={5}>
            Notifications
          </Heading>
        </View>
      )}

      <FlatList
        data={notificationList?.data}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 240 }}
        renderItem={({ item }) => {
          const url = urlResolver(item);

          const timeAgo = item?.created_at
            ? formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })
            : "";

          return (
            <TouchableOpacity
              disabled={!url}
              onPress={() => handleNotificationPress(url)}
            >
              <Grid direction="row" style={styles.cardItem} gap={8}>
                <AppImage
                  path={item?.data?.image}
                  width={48}
                  height={48}
                  style={styles.notificationImage}
                />
                <Grid direction="column" gap={4} style={{ flex: 1 }}>
                  {item?.data?.title && (
                    <Heading
                      weight="semiBold"
                      variant={5}
                      style={{ marginBottom: -4 }}
                    >
                      {item?.data?.title}
                    </Heading>
                  )}
                  <RichText html={item?.data?.message} />
                  <Text>{timeAgo}</Text>
                </Grid>
              </Grid>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={() =>
          hasMore && hasNotifications ? (
            <View style={{ padding: 16 }}>
              <Button
                title={loadingMore ? "Loading..." : "Load More"}
                disabled={loadingMore}
                onPress={loadMoreNotifications}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    padding: 16,
    backgroundColor: WHITE,
  },
  notificationImage: {
    borderRadius: 80,
    borderWidth: 1,
  },
});
