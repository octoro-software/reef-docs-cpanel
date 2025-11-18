import React, { useEffect } from "react";
import { useNavigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppSelector } from "../hooks/useRedux";
import { usePushNotificationCheck } from "../hooks/usePushNotifications";
import { useAudience } from "../hooks/useAudience";
import { useModal } from "../hooks/useModal";
import { useSelectWishList } from "../hooks/useWishList";

import {
  selectRecentlyAdded,
  selectRecentlyContributed,
  selectRecentlyViewed,
  selectTrendingCoral,
  selectTrendingLiveStock,
  selectUrgentPosts,
} from "../store/slices/globalSlice";
import { selectFeaturedArticles } from "../store/slices/moreSlice";

import { sendEventOnce } from "../utility/analytics";

import { AppImage, Grid, RichText, Text } from "../components";
import { Carousel } from "../elements/Carousel/Carousel";
import { BannerImage } from "../components/BannerImage/BannerImage";
import { getAppDimensions } from "../utility/dimensions";
import { useGetRecentContributions } from "../hooks/useLiveStock";
import { useGetLatestUrgentPosts } from "../hooks/usePosts";
import { TouchableOpacity, View } from "react-native";
import { READING_AND_TOOLS_PATH } from "../constants";

const deviceWidth = getAppDimensions().width;

export const HomeScreen: React.FC = () => {
  const recentlyViewed = useAppSelector(selectRecentlyViewed);
  const recentlyContributed = useAppSelector(selectRecentlyContributed);
  const recentlyAdded = useAppSelector(selectRecentlyAdded);
  const trendingLiveStock = useAppSelector(selectTrendingLiveStock);
  const trendingCorals = useAppSelector(selectTrendingCoral);
  const featuredArticles = useAppSelector(selectFeaturedArticles);
  const urgentPosts = useAppSelector(selectUrgentPosts);

  const [getRecentlyContributed] = useGetRecentContributions();
  const [getLatestUrgentPosts] = useGetLatestUrgentPosts();

  const { isFresh } = useAudience();

  usePushNotificationCheck();

  const { openModal } = useModal();

  const handleOpenFeedbackModal = () => {
    openModal({
      type: "feedbackModal",
      modalTitle: "Feedback",
      height: "large",
    });
  };

  const handleLiveStockNavigate = (id, item, disablePreFill = false) => {
    if (item?.plant_coral) {
      navigate(`/coral/${id}`, {
        state: disablePreFill ? {} : { data: item },
      });
    } else {
      navigate(`/livestock/${id}`, {
        state: disablePreFill ? {} : { data: item },
      });
    }
  };

  const handlePostPress = (id) => {
    navigate(`/social?postId=${id}`);
  };

  const { corals, liveStock } = useSelectWishList();

  const navigate = useNavigate();

  sendEventOnce("DASHBOARD_VIEW", {});

  const MAIN_BANNERS = isFresh
    ? [
        {
          url: "app/banners/fresh-social-banner.png",
          aspectRatio: 1.778,
          onPress: () => navigate("/social"),
        },
        {
          url: "app/banners/used-equipment-marketplace.png",
          aspectRatio: 1.778,
          onPress: () => navigate("/used-marketplace"),
        },
        {
          onPress: () =>
            navigate("/livestock?filter=fish_type_family_common:Plecos&page=1"),
          url: "app/banners/pleco-banner-1.png",
          aspectRatio: 1.778,
        },
        {
          onPress: handleOpenFeedbackModal,
          url: "app/banners/banner-design-2.png",
          aspectRatio: 1.778,
        },
      ]
    : [
        {
          url: "app/banners/reef-social-banner.png",
          aspectRatio: 1.778,
          onPress: () => navigate("/social"),
        },
        {
          url: "app/banners/used-equipment-marketplace.png",
          aspectRatio: 1.778,
          onPress: () => navigate("/used-marketplace"),
        },
        {
          onPress: () =>
            navigate("/livestock?filter=fish_type_family:Acanthuridae&page=1"),
          url: "app/banners/banner-design-1.png",
          aspectRatio: 1.778,
        },
        {
          onPress: handleOpenFeedbackModal,
          url: "app/banners/banner-design-2.png",
          aspectRatio: 1.778,
        },
      ];

  const handleUpdateModal = async () => {
    const hasRanBefore = await AsyncStorage.getItem("whatsNewModal");

    const ftu = await AsyncStorage.getItem("ftu");

    if (!ftu) {
      openModal({
        type: "ftuModal",
        modalTitle: "Getting Started",
        height: "large",
        data: {
          type: "home",
        },
      });

      await AsyncStorage.setItem("ftu", "home");
    } else if (!hasRanBefore || hasRanBefore !== "social-update1") {
      openModal({
        type: "whatsNewModal",
        modalTitle: "What's New",
        height: "large",
      });

      await AsyncStorage.setItem("whatsNewModal", "social-update1");
    }
  };

  useEffect(() => {
    handleUpdateModal();
  }, []);

  return (
    <>
      <Grid direction="column" gap={16} style={{ marginTop: 4 }}>
        <Carousel
          data={MAIN_BANNERS}
          eventId="DASHBOARD_MAIN_BANNER"
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
          slidesToShow={1}
          disableContent
          showIndicators
          renderCard={(item, cardWidth) => {
            return (
              <BannerImage
                width={cardWidth - 16}
                url={item.url}
                aspectRatio={item.aspectRatio}
                onPress={item.onPress}
                rounded={true}
              />
            );
          }}
        />

        <Carousel
          title="Urgent Posts"
          data={urgentPosts}
          eventId="DASHBOARD_URGENT_POSTS"
          onPressCallback={(id, item) => handlePostPress(id, item, true)}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
          getDataFn={getLatestUrgentPosts}
          fullWidth
          renderCard={(item, cardWidth) => (
            <TouchableOpacity
              onPress={() => handlePostPress(item.id)}
              style={{ padding: 8, width: cardWidth }}
            >
              <View style={{ height: 38 }}>
                <RichText
                  html={item?.richTextContent}
                  hideShowMoreLabel
                  charLimit={40}
                  showMore={true}
                />
              </View>

              <Text style={{ fontSize: 12 }}>@{item?.user?.userName}</Text>

              <View
                style={{
                  backgroundColor: "red",
                  marginBottom: -8,
                  marginLeft: -8,
                  marginRight: -8,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    color: "white",
                    padding: 4,
                  }}
                >
                  Urgent
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showAllResultsUrl="/social/urgent"
        />

        {!isFresh && (
          <BannerImage
            aspectRatio={4}
            url="app/banners/coral-database-calculator.png"
            onPress={() =>
              openModal({
                type: "liveStockRequestFormModal",
                modalTitle: "Contribute Coral",
                height: "large",
                data: {
                  coralRequest: true,
                },
              })
            }
          />
        )}
        {isFresh && (
          <BannerImage
            aspectRatio={4}
            url="app/banners/dosing-calculator-banner.png"
            onPress={() => navigate(READING_AND_TOOLS_PATH)}
          />
        )}

        <Carousel
          title="Recent Contributions"
          data={recentlyContributed}
          eventId="DASHBOARD_RECENTY_CONTRIBUTIONS"
          onPressCallback={(id, item) =>
            handleLiveStockNavigate(id, item, true)
          }
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
          getDataFn={getRecentlyContributed}
        />

        <Carousel
          title="Recently Viewed"
          data={recentlyViewed}
          eventId="DASHBOARD_RECENTY_VIEWED"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        {!isFresh && (
          <BannerImage
            url="/app/banners/video-reef.png"
            width={deviceWidth - 32}
            aspectRatio={1.778}
          />
        )}
        {isFresh && (
          <BannerImage
            url="/app/banners/video-fresh-2.png"
            width={deviceWidth - 32}
            aspectRatio={1.778}
          />
        )}

        <Carousel
          title="Favourites"
          data={liveStock}
          eventId="DASHBOARD_FAVOURITES"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        <Carousel
          title={isFresh ? "Plant Favourites" : "Coral Favourites"}
          data={corals}
          eventId="DASHBOARD_CORAL_PLANT_FAVOURITES"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        <Carousel
          title="Latest Arrivals"
          data={recentlyAdded}
          eventId="DASHBOARD_LATEST_ARRIVALS"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        <Carousel
          title="Featured Articles"
          data={featuredArticles}
          eventId="DASHBOARD_ARTICLES"
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
          slidesToShow={1.3}
          disableContent
          renderCard={(item, cardWidth) => {
            return (
              <BannerImage
                width={cardWidth}
                url={item.images?.[0]?.url}
                aspectRatio={1.778}
                onPress={() => {
                  if (item?.featuredChildRootMenu) {
                    navigate(`/more?article=${item?.url}&showRootMenu=true`);
                  } else {
                    navigate(`/more?article=${item?.url}`);
                  }
                }}
              />
            );
          }}
        />

        <Carousel
          title="Trending Livestock"
          data={trendingLiveStock}
          eventId="DASHBOARD_TRENDING_LIVESTOCK"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        <Carousel
          title={isFresh ? "Trending Plants" : "Trending Corals"}
          data={trendingCorals}
          eventId="DASHBOARD_TRENDING_CORALS"
          onPressCallback={handleLiveStockNavigate}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
        />

        {/* <Carousel
          title={"Partner Network"}
          data={partners}
          eventId="DASHBOARD_PARTNER_NETWORK"
          onPressCallback={handlePartnerStorePress}
          generateEventData={(item) => ({
            dataId: item?.id,
          })}
          resizeMode="contain"
        /> */}

        <BannerImage
          aspectRatio={1.778}
          url="app/banners/banner-design-2.png"
          onPress={handleOpenFeedbackModal}
        />
      </Grid>
    </>
  );
};
