import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLocation } from "react-router-native";
import { BackHandler } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";
import { sendEvent } from "../../utility/analytics";

import {
  Grid,
  GridItem,
  Heading,
  Icon,
  RichText,
  Text,
} from "../../components";

import { useGetArticleBySlug } from "../../hooks/useArticles";
import { useQueryParams } from "../../hooks/useQueryParams";

import { BLACK, INPUT_BORDER_COLOR, WHITE } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectArticleData,
  selectArticleHistory,
  selectArticleScrollPosition,
  selectArticleSlug,
  setArticleData,
  setArticleHistory,
  setScrollPositions,
  setSelectedArticleSlug,
} from "../../store/slices/moreSlice";
import { ARTICLE_MENU } from "../../constants/articles";
import { useIsDemo } from "../../hooks/useAuth";
import { NoDataFallbackCard } from "../../elements/NoDataFallbackCard/NoDataFallbackCard";

const SCREEN_WIDTH = getAppDimensions().width;

export const MoreScreen = () => {
  const dispatch = useAppDispatch();
  const [getArticleBySlug, getArticleLoading] = useGetArticleBySlug();

  const selectedArticleSlug = useAppSelector(selectArticleSlug);
  const articleData = useAppSelector(selectArticleData);
  const history = useAppSelector(selectArticleHistory);
  const scrollPositions = useAppSelector(selectArticleScrollPosition);

  const location = useLocation();

  const { getParam } = useQueryParams();

  const scrollRefs = useRef({});

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const onBackPress = () => {
      if (history.length > 1) {
        handlePreviousStep();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [history]);

  useEffect(() => {
    const articleUrl = getParam("article");
    const deepLink = getParam("deepLink");
    const showRootMenu = getParam("showRootMenu") === "true";

    if (articleUrl && (articleUrl !== selectedArticleSlug || deepLink)) {
      if (deepLink) {
        dispatch(setArticleHistory([]));
      }

      if (showRootMenu) {
        // Find the root menu that contains this article
        const articleRootMenu = findLastSectionWithChildren(
          ARTICLE_MENU,
          articleUrl
        );

        if (articleRootMenu.length > 0) {
          dispatch(setArticleHistory([ARTICLE_MENU, articleRootMenu]));

          dispatch(setSelectedArticleSlug(articleUrl));
          dispatch(setArticleData(null));

          translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 });

          getArticleBySlug(articleUrl).then((article) => {
            if (article?.status === 200) {
              dispatch(setArticleData(article.data.data));
              sendEvent("ARTICLE_VIEW", {
                articleUrl: article.data.data?.url,
                title: article.data.data?.title,
              });
            }
          });

          setTimeout(() => {
            scrollRefs.current[1]?.scrollTo({ y: 0, animated: false });
          }, 300);
        } else {
          handleNextStep({ url: articleUrl }, false);
        }
      } else {
        handleNextStep({ url: articleUrl }, true);
      }
    }
  }, [location.search]);

  const handleNextStep = async (submenu, globalSearch = false) => {
    if (submenu?.url) {
      const slug = submenu.url;
      dispatch(setSelectedArticleSlug(slug));
      dispatch(setArticleData(null));

      const newHistory = [...history, "ARTICLE"];
      dispatch(setArticleHistory(newHistory));

      translateX.value = withTiming(-SCREEN_WIDTH * (newHistory.length - 1), {
        duration: 200,
      });

      getArticleBySlug(slug).then((article) => {
        if (article?.status === 200) {
          dispatch(setArticleData(article.data.data));
          sendEvent(
            globalSearch ? "ARTICLE_VIEW_GLOBAL_SEARCH" : "ARTICLE_VIEW",
            {
              articleUrl: article.data.data?.url,
              title: article.data.data?.title,
            }
          );
        }
      });

      setTimeout(() => {
        scrollRefs.current[newHistory.length - 1]?.scrollTo({
          y: 0,
          animated: false,
        });
      }, 300);

      return;
    }

    if (!submenu?.children) return;

    const currentIndex = history.length - 1;
    scrollRefs.current[currentIndex]?.scrollTo({ y: 0, animated: false });

    const newHistory = [...history, submenu.children]; // calculate it manually
    dispatch(setArticleHistory(newHistory));

    translateX.value = withTiming(-SCREEN_WIDTH * history.length, {
      duration: 200,
    });

    setTimeout(() => {
      scrollRefs.current[history.length]?.scrollTo({ y: 0, animated: false });
    }, 300);
  };

  const handlePreviousStep = () => {
    if (history.length <= 1) return;

    const newHistory = history.slice(0, -1); // remove top step

    // If you're moving back from ARTICLE view to a menu
    if (history[history.length - 1] === "ARTICLE") {
      dispatch(setArticleData(null)); // clear article content
      dispatch(setSelectedArticleSlug(null));
    }

    translateX.value = withTiming(-SCREEN_WIDTH * (newHistory.length - 1), {
      duration: 200,
    });

    setTimeout(() => {
      dispatch(setArticleHistory(newHistory));
    }, 200);
  };

  const isDemo = useIsDemo();

  const hasArticle = (item) => {
    if (item?.url) {
      return true;
    }
    if (item?.children) {
      return item.children.some((child) => hasArticle(child));
    }
  };

  const renderMenu = (menuItems) => {
    return menuItems?.map((item, index) => (
      <View key={index} style={styles.menuItem}>
        {item.sectionLabel && (
          <Heading
            variant={5}
            weight="semiBold"
            style={{ paddingLeft: 16, paddingRight: 16 }}
          >
            {item.sectionLabel}
          </Heading>
        )}

        {item.children && (
          <Grid>
            {item.children.map((child, childIndex) => (
              <TouchableOpacity
                key={childIndex}
                disabled={!hasArticle(child)}
                onPress={() => handleNextStep(child)}
                style={styles.menuWrapper}
              >
                <Grid direction="row" justifyContent="space-between">
                  <GridItem flex={1}>
                    <Text>
                      {child.label || child.sectionLabel}
                      {!hasArticle(child) && !isDemo && " ( Coming Soon )"}
                    </Text>
                  </GridItem>

                  <Icon name="chevronRight" fill={BLACK} />
                </Grid>
              </TouchableOpacity>
            ))}
          </Grid>
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH * history.length,
              flexDirection: "row",
            },
            animatedStyle,
          ]}
        >
          {history?.[0]?.length > 0 ? (
            history?.map((currentMenu, index) => (
              <View key={index} style={styles.stepContainer}>
                <ScrollView
                  ref={(ref) => (scrollRefs.current[index] = ref)}
                  onScroll={(e) => {
                    const scrollY = e.nativeEvent.contentOffset.y;
                    dispatch(
                      setScrollPositions((prev) => ({
                        ...prev,
                        [index]: scrollY,
                      }))
                    );
                  }}
                  scrollEventThrottle={16}
                  contentContainerStyle={{
                    paddingBottom: 160,
                  }}
                  onContentSizeChange={() => {
                    const scrollY = scrollPositions[index] || 0;
                    scrollRefs.current[index]?.scrollTo({
                      y: scrollY,
                      animated: false,
                    });
                  }}
                >
                  <Grid>
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={handlePreviousStep}
                        style={[styles.menuWrapper, { marginBottom: 16 }]}
                      >
                        <Grid direction="row" gap={8}>
                          <Icon name="chevronLeft" fill={BLACK} />
                          <GridItem flex={1} justifyContent="center">
                            <Text>Back</Text>
                          </GridItem>
                        </Grid>
                      </TouchableOpacity>
                    )}

                    {currentMenu === "ARTICLE"
                      ? renderArticleContent(articleData)
                      : Array.isArray(currentMenu)
                        ? renderMenu(currentMenu)
                        : null}
                  </Grid>
                </ScrollView>
              </View>
            ))
          ) : (
            <View style={{ padding: 8, justifyContent: "center", flex: 1 }}>
              <NoDataFallbackCard
                title="No Articles Yet"
                centered
                icon="reefDocsArticles"
                description="We are working hard on adding more articles. Please check back later."
              />
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 60,
  },
  sliderContainer: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
  },
  animatedContainer: {
    flexDirection: "row",
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  menuItem: {
    marginBottom: 20,
  },
  menuWrapper: {
    padding: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    backgroundColor: WHITE,
  },
  skeletonContainer: {
    paddingTop: 16,
    gap: 12,
  },
  skeletonBox: {
    height: 28,
    width: "80%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

const renderArticleContent = (articleData) => {
  return (
    <View style={{}}>
      {articleData ? (
        <>
          <View style={{ backgroundColor: WHITE, padding: 16 }}>
            <Heading variant={4} weight="semiBold">
              {articleData?.title}
            </Heading>

            <Grid
              direction="row"
              gap={8}
              alignItems="center"
              style={{ marginBottom: 16, marginTop: 8 }}
            >
              <Grid direction="row" alignItems="center" gap={8}>
                <Icon
                  name="reefDocsArticles"
                  width={32}
                  height={32}
                  strokeWidth={1}
                />
                <Text>{articleData?.readTime ?? 20} Minute Read</Text>
              </Grid>
            </Grid>

            <RichText html={articleData?.content} styles={{ em: {} }} />
          </View>
        </>
      ) : (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonBox} />
          <View style={[styles.skeletonLine, { width: "60%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "90%" }]} />
          <View style={[styles.skeletonLine, { width: "75%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
          <View style={[styles.skeletonLine, { width: "100%" }]} />
        </View>
      )}
    </View>
  );
};

const findMenuPath = (menus, targetUrl, path = []) => {
  let bestMatch = [];

  for (let item of menus) {
    const currentPath = [...path, item];

    if (item.url === targetUrl) {
      // Save current match
      if (currentPath.length > bestMatch.length) {
        bestMatch = currentPath;
      }
    }

    if (item.children) {
      const result = findMenuPath(item.children, targetUrl, currentPath);
      if (result.length > bestMatch.length) {
        bestMatch = result;
      }
    }
  }

  return bestMatch;
};

const findLastSectionWithChildren = (menus, targetUrl) => {
  const path = findMenuPath(menus, targetUrl);

  // Walk backward from the end of the path
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i]?.children && Array.isArray(path[i].children)) {
      return [path[i]];
    }
  }

  return []; // No section with children found
};
