import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Zoomable } from "@likashefqet/react-native-image-zoom";

import { getAppDimensions } from "../../utility/dimensions";

import { Grid } from "../Grid/Grid";
import { AppImage } from "../AppImage/AppImage";
import { CarouselIndicators } from "../CarouselIndicators/CarouselIndicators";
import { Skeleton } from "../Skeleton/Skeleton";
import { Z_INDEX } from "../../constants";
import { Text } from "../Text/Text";

const screenWidth = getAppDimensions().width;
const imageWidth = screenWidth - 32;
const gap = 16;
const snapInterval = imageWidth + gap;

type Props = {
  images: Array<{ url: string; userName?: string }>;
  indicatorAbsolute?: boolean;
  priority: "low" | "normal" | "high";
  imageStyles?: object;
  loading?: boolean;
  showIndicators?: boolean;
  transition?: number;
};

export const LiveStockProfileCarousel: React.FC<Props> = ({
  images,
  indicatorAbsolute = false,
  priority,
  imageStyles = {},
  loading,
  showIndicators = true,
  transition = 500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / snapInterval);
    setCurrentIndex(index);
  };

  return (
    <Grid gap={16}>
      {loading && !images ? (
        <Skeleton width={imageWidth} height={320} marginBottom={0} />
      ) : (
        <View
          style={{
            height: 320,
            overflow: "hidden",
            borderRadius: 16,
            ...imageStyles,
          }}
        >
          {images?.length > 0 ? (
            <Zoomable
              doubleTapScale={3}
              isSingleTapEnabled
              isDoubleTapEnabled
              isPinchEnabled={false}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={snapInterval}
                decelerationRate="fast"
                bounces={false} // prevents iOS rubber banding
                overScrollMode="never" // Android-only: prevents over-scroll
                onMomentumScrollEnd={handleScrollEnd}
                style={{ height: 320 }}
              >
                {images?.map((image, index) => {
                  const isLast = index === images.length - 1;

                  return (
                    <View style={{ position: "relative" }} key={index}>
                      <AppImage
                        style={[
                          style.image,
                          isLast && { marginRight: 0 },
                          imageStyles,
                        ]}
                        path={image.url}
                        height={320}
                        width={imageWidth}
                        priority={priority}
                        transition={transition}
                      />
                      {image?.userName && (
                        <Text
                          style={{
                            position: "absolute",
                            color: "white",
                            left: 16,
                            bottom: 16,
                          }}
                        >
                          @{image.userName}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </Zoomable>
          ) : (
            <View style={{ backgroundColor: "white" }}>
              <Image
                source={require("../../media/aqua_docs_transparent.png")}
                style={{ width: imageWidth, height: 320, borderRadius: 16 }}
              />
            </View>
          )}
        </View>
      )}

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
          <CarouselIndicators
            total={images?.length}
            activeIndex={currentIndex}
          />
        </View>
      )}
    </Grid>
  );
};

const style = StyleSheet.create({
  image: {
    borderRadius: 16,
    resizeMode: "cover",
    marginRight: gap,
  },
});
