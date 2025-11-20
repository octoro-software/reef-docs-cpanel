import React, { useRef, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { getAppDimensions } from "../../utility/dimensions";

const { height, width } = getAppDimensions();

type DashboardCarouselProps = {
  children: React.ReactNode;
  autoScroll?: boolean;
};

export const DashboardCarousel: React.FC<DashboardCarouselProps> = ({
  children,
  autoScroll = false,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const childArray = React.Children.toArray(children);
  const totalPages = childArray.length;

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % totalPages;
      setCurrentIndex(nextIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }
    }, 4000); // 4 seconds per page
    return () => clearInterval(interval);
  }, [currentIndex, totalPages, autoScroll]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      scrollEventThrottle={16}
    >
      {childArray}
    </ScrollView>
  );
};

export const DashboardCarouselItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <View style={styles.item}>{children}</View>;
};

const styles = StyleSheet.create({
  item: {
    width: width,
    paddingHorizontal: 20,
  },
});
