import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigate } from "react-router-native";

import { getAppDimensions } from "../../utility/dimensions";
import { EventIds, sendEvent } from "../../utility/analytics";

import { AppImage } from "../../components/AppImage/AppImage";

import { Grid, GridItem, Text } from "../../components";
import { ScrollView as RNScrollView } from "react-native";

import { REEF_DOCS_BLUE, WHITE, Z_INDEX } from "../../constants";
import { CarouselIndicators } from "../../components/CarouselIndicators/CarouselIndicators";
import { Skeleton } from "../../components/Skeleton/Skeleton";

const { width } = getAppDimensions();

type CarouselProps = {
  eventId: EventIds;
  showAllResultsEventId?: EventIds;
  resizeMode?: "cover" | "contain";
  showAllResultsUrl?: string | null;
  title?: string;
  slidesToShow?: number;
  onPressCallback?: (id: string, item: any) => void;
  generateEventData: (item: any) => any;
  data: any[];
  disableContent?: boolean;
  renderCard?: (item: any, cardWidth: number) => React.ReactNode;
  indicatorAbsolute?: boolean;
  showIndicators?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  fullWidth?: boolean;
  rounded?: boolean;
  showWithoutData?: boolean;
  pillText?: string;
  getDataFn?: () => Promise<any>;
};

const screenWidth = getAppDimensions().width;

export const Carousel: React.FC<CarouselProps> = ({
  title,
  data,
  showAllResultsUrl = null,
  resizeMode = "cover",
  eventId,
  showAllResultsEventId,
  slidesToShow = 2.4,
  onPressCallback,
  generateEventData,
  disableContent = false,
  renderCard,
  indicatorAbsolute,
  showIndicators = false,
  autoScroll = false,
  autoScrollInterval = 3000,
  fullWidth,
  rounded = true,
  showWithoutData = false,
  pillText = "View All",
  getDataFn = null,
}) => {
  const [loading, setLoading] = useState(
    data?.length === 0 && getDataFn ? true : false
  );

  const handleGetData = async () => {
    if (!data || data?.length === 0) {
      setLoading(true);
    }

    await getDataFn?.();

    setLoading(false);
  };

  useEffect(() => {
    if (!getDataFn) return;

    handleGetData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const scrollRef = useRef<RNScrollView>(null);

  const handleNavigate = (id, item) => {
    onPressCallback(id, item);
    sendEvent(eventId, generateEventData(item));
  };

  const handleShowAllResults = () => {
    sendEvent(showAllResultsEventId, {
      showAllResults: true,
      showAllResultsUrl,
    });

    navigate(showAllResultsUrl);
  };
  const handleScrollEnd = (event) => {
    if (!showIndicators) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / snapInterval) % data.length;
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: middleIndexOffset * snapInterval,
        animated: false,
      });
      setCurrentIndex(0); // relative to the middle set
    }
  }, []);

  const cardGap = slidesToShow === 1 ? 8 : 8;
  const middleIndexOffset = data?.length;

  const horizontalPadding = fullWidth ? 0 : 16; // or whatever spacing you're using
  const cardWidth = width / slidesToShow - horizontalPadding;

  const snapInterval = cardWidth + cardGap;

  const loopedData = autoScroll ? [...data, ...data, ...data] : data;

  useEffect(() => {
    if (!autoScroll || data.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;

      const absoluteIndex = middleIndexOffset + nextIndex;

      scrollRef.current?.scrollTo({
        x: absoluteIndex * snapInterval,
        animated: true,
      });

      setCurrentIndex(nextIndex);

      // Reset to middle when reaching end of middle segment
      if (nextIndex >= data.length) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: middleIndexOffset * snapInterval,
            animated: false,
          });
          setCurrentIndex(0);
        }, 500);
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [
    autoScroll,
    currentIndex,
    data?.length,
    snapInterval,
    autoScrollInterval,
  ]);

  if (!data?.length && !showWithoutData) return null;

  return (
    <Grid gap={16}>
      {title && (
        <Grid
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {title && <Text weight="bold">{title}</Text>}

          {showAllResultsUrl && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleShowAllResults}
            >
              <Text style={styles.viewAllText}>{pillText}</Text>
            </TouchableOpacity>
          )}
        </Grid>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={slidesToShow === 1 ? snapInterval : undefined}
        contentContainerStyle={{}}
      >
        <Grid gap={16} direction="row">
          {loopedData.map((item, index) => {
            const isLast = index === data.length - 1 && slidesToShow === 1;

            return (
              <GridItem
                key={index}
                gap={slidesToShow === 1 ? 0 : cardGap}
                style={[
                  styles.item,
                  { width: isLast ? cardWidth - 16 : cardWidth },
                  { borderRadius: rounded ? 8 : 0 },
                ]} // match exact width
              >
                {renderCard ? (
                  renderCard(item, cardWidth)
                ) : loading ? (
                  <CarouselCardSkeleton
                    cardWidth={cardWidth}
                    disableContent={disableContent}
                  />
                ) : (
                  <CarouselCard
                    item={item}
                    cardWidth={cardWidth}
                    handleNavigate={handleNavigate}
                    rounded={rounded}
                    disableContent={disableContent}
                    resizeMode={resizeMode}
                  />
                )}
              </GridItem>
            );
          })}
        </Grid>
      </ScrollView>

      {showIndicators && (
        <View
          style={
            indicatorAbsolute
              ? {
                  marginTop: -32,
                  position: "absolute",
                  zIndex: Z_INDEX.liveStockProfileCarouselIndicator,
                  bottom: 10,
                  justifyContent: "center",
                  width: screenWidth - 32,
                }
              : {}
          }
        >
          <CarouselIndicators total={data?.length} activeIndex={currentIndex} />
        </View>
      )}
    </Grid>
  );
};

const CarouselCardSkeleton = ({ cardWidth, disableContent }) => {
  return (
    <View>
      <Skeleton
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        width={cardWidth}
        height={disableContent ? 150 : 96}
      />

      <Skeleton height={12} marginBottom={4} width={cardWidth} />
      <Skeleton height={12} marginBottom={4} width={cardWidth} />
    </View>
  );
};

const CarouselCard = ({
  item,
  cardWidth,
  handleNavigate,
  rounded,
  disableContent,
  resizeMode,
}) => {
  return (
    <TouchableOpacity onPress={() => handleNavigate(item?.id, item)}>
      <AppImage
        path={item?.images?.[0]?.url}
        style={[
          styles.image,
          {
            borderRadius: rounded ? 8 : 0,
          },
          disableContent
            ? {}
            : {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
        ]}
        width={cardWidth}
        height={disableContent ? 150 : 96}
        resizeMode={resizeMode}
        transform
      />
      {!disableContent && (
        <View style={{ padding: 8 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" weight="semiBold">
            {item?.name}
          </Text>
          <Text style={{ fontSize: 10 }} weight="regular">
            {item?.scientific_name}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: WHITE,
  },
  image: {
    borderRadius: 8,
    height: 96,
    width: "100%",
  },
  viewAllButton: {
    backgroundColor: REEF_DOCS_BLUE,
    padding: 4,
    borderRadius: 8,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllText: {
    color: WHITE,
    fontSize: 12,
  },
});
