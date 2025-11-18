import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { selectLiveStockProfile } from "../../../../store/slices/liveStockSlice";

import { useAppSelector } from "../../../../hooks/useRedux";
import { useGetVideoContributions } from "../../../../hooks/useLiveStock";

import { Button, ModalComposition } from "../../../../components";
import { NoDataFallbackCard } from "../../../NoDataFallbackCard/NoDataFallbackCard";
import {
  LiveStockVideoCard,
  LiveStockVideoCardSkeleton,
} from "./LiveStockVideoCard";
import { VideoCarouselPips } from "../../../../components/VideoCarouselPips";
import { getAppDimensions } from "../../../../utility/dimensions";

export const LiveStockProfileUserVideos = ({
  handleNextStep,
  liveStockId,
  icon,
  height,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [getLiveStockVideos] = useGetVideoContributions();

  const videoHeight = height - 113;

  const handleGetData = async () => {
    setLoading(true);
    await getLiveStockVideos(liveStockId);
    setLoading(false);
  };

  const videos = useAppSelector(selectLiveStockProfile(liveStockId))?.userVideos
    ?.data;

  useEffect(() => {
    handleGetData();
  }, []);

  const renderHeader = () => (
    <>
      {videos?.length === 0 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: getAppDimensions().width,
          }}
        >
          <NoDataFallbackCard
            title="No Video Contributions"
            icon={icon ?? "reefDocsHelp"}
            description="Be the first, show the community this animal."
          />
        </View>
      )}
    </>
  );

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / height); // height is your snap interval

    if (newIndex < 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex(newIndex);
    }
  };

  return (
    <ModalComposition
      padding={false}
      footerStyle={[{
        marginLeft: 16,
        
      }, Platform.OS === "ios" && { marginBottom: 16 }]}
      renderFooter={() => (
        <Button title="Contribute" onPress={() => handleNextStep(1)} />
      )}
    >
      <View style={{ flex: 1 }}>
        {!loading && (
          <VideoCarouselPips
            total={videos?.length}
            activeIndex={activeIndex}
            maxVisible={5}
          />
        )}

        <FlashList
          horizontal={true}
          data={loading ? Array.from({ length: 1 }) : videos}
          renderItem={
            loading
              ? () => <LiveStockVideoCardSkeleton videoHeight={videoHeight} />
              : ({ item, index }: any) => (
                  <LiveStockVideoCard
                    bunnyVideoId={item?.bunnyVideoId}
                    user={item?.user}
                    orientation={item?.orientation}
                    height={height}
                    hasLeft={index > 0}
                    hasRight={index < (videos?.length || 0) - 1}
                    videoHeight={videoHeight}
                    active={index === activeIndex}
                  />
                )
          }
          keyExtractor={
            loading
              ? (_, idx) => `skeleton-${idx}`
              : (item: any, index) => `${item?.id}`
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={5}
          ListHeaderComponent={renderHeader}
          showsHorizontalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    </ModalComposition>
  );
};
