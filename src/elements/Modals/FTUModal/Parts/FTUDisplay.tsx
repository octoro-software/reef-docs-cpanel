import React, { useRef, useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";

import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  Text,
} from "../../../../components";
import { CarouselIndicators } from "../../../../components/CarouselIndicators/CarouselIndicators";

import { useModal } from "../../../../hooks/useModal";

const { width } = Dimensions.get("window");

export const FTUDisplay: React.FC<{ cards: any[]; isFresh: boolean }> = ({
  cards,
  isFresh,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { closeModal } = useModal();

  const handleNextStep = () => {
    if (activeIndex < cards.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (activeIndex + 1),
        animated: true,
      });
    }
  };

  const handlePreviousStep = () => {
    if (activeIndex > 0) {
      scrollRef.current?.scrollTo({
        x: width * (activeIndex - 1),
        animated: true,
      });
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  const canFinish = activeIndex === cards.length - 1;

  return (
    <ModalComposition
      padding={false}
      footerStyle={styles.footerContainer}
      renderFooter={() => {
        if (activeIndex === 0 && cards.length > 1) {
          return (
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Button
                  title="Next"
                  onPress={handleNextStep}
                  variant="secondary"
                />
              </GridItem>
            </Grid>
          );
        }

        if (activeIndex === 0 && cards.length === 1) {
          return (
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Button title="Finish" onPress={closeModal} variant="success" />
              </GridItem>
            </Grid>
          );
        }

        return (
          <Grid direction="row" gap={8}>
            <GridItem flex={1}>
              <Button title="Previous" onPress={handlePreviousStep} />
            </GridItem>
            <GridItem flex={1}>
              {canFinish ? (
                <Button title="Finish" onPress={closeModal} variant="success" />
              ) : (
                <Button
                  title="Next"
                  onPress={handleNextStep}
                  variant="secondary"
                />
              )}
            </GridItem>
          </Grid>
        );
      }}
    >
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {cards.map((card, index) => {
          const CustomCard = card.customCard;
          return (
            <View style={styles.cardContainer} key={index}>
              <View style={styles.cardContent}>
                <Heading weight="semiBold" variant={4}>
                  {card.title}
                </Heading>
                <Text weight="semiBold" style={styles.subtitle}>
                  {isFresh
                    ? card.freshSubTitle ?? card?.subTitle
                    : card.subTitle}
                </Text>
                {CustomCard ? (
                  <View style={styles.customCardWrapper}>
                    <CustomCard />
                  </View>
                ) : (
                  <AppImage
                    path={
                      isFresh ? card?.freshImage ?? card.image : card?.image
                    }
                    width={width}
                    height={300}
                    {...(card?.imageProps ?? {})}
                  />
                )}
                <Text weight="semiBold" style={styles.description}>
                  {isFresh
                    ? card?.freshDescription ?? card.description
                    : card.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        <CarouselIndicators total={cards.length} activeIndex={activeIndex} />
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: width + 16,
    paddingLeft: 32,
    paddingBottom: 32,
  },
  cardContainer: {
    width,
    alignItems: "center",
  },
  cardContent: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    marginBottom: 16,
  },
  description: {
    marginTop: 16,
  },
  customCardWrapper: {
    width,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 150,
    zIndex: 9999,
    width,
  },
});
