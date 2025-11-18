import React, { useState } from "react";
import { Grid, GridItem } from "../../components";
import { ScrollView, View } from "react-native";
import { getAppDimensions } from "../../utility/dimensions";
import { LiveStockDataCard } from "../LiveStockDataCard/LiveStockDataCard";
import { CarouselIndicators } from "../../components/CarouselIndicators/CarouselIndicators";

const { width } = getAppDimensions();

export const LiveStockDataCarousel = ({ cardGroups, id, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width); // Calculate index based on width
    setCurrentIndex(index);
  };

  return (
    <GridItem flex={1} gap={16}>
      <ScrollView
        horizontal
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View style={{ flexDirection: "row" }}>
          {cardGroups.map((group, index) => {
            const isLast = index === cardGroups.length - 1;

            return (
              <View key={index} style={{ width: isLast ? width - 32 : width }}>
                <Grid direction="row" gap={16}>
                  {Array(2)
                    .fill(0)
                    .map((_, colIndex) => (
                      <Grid key={colIndex} direction="column" gap={16} flex={1}>
                        {group
                          .filter((_, i) => Math.floor(i / 2) === colIndex)
                          .map((card, i) => {
                            if (
                              group?.[0]?.definition === "livestock_temperament"
                            ) {
                              <LiveStockDataCard
                                {...card}
                                key={i}
                                id={id}
                                loading={loading && !card?.value}
                              />;
                            }

                            return (
                              <LiveStockDataCard
                                {...card}
                                key={i}
                                id={id}
                                loading={loading && !card?.value}
                              />
                            );
                          })}
                      </Grid>
                    ))}
                </Grid>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <CarouselIndicators total={5} activeIndex={currentIndex} />
    </GridItem>
  );
};
