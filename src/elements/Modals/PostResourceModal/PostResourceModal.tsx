import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useModal } from "../../../hooks/useModal";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  Text,
} from "../../../components";
import { useGetLiveStockPostResourceSummary } from "../../../hooks/useLiveStock";
import { LiveStockProfileCarousel } from "../../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import { WHITE } from "../../../constants";
import { useNavigate } from "react-router-native";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  selectSocialFullScreen,
  setSocialFullScreen,
} from "../../../store/slices/globalSlice";

export const PostResourceModal = ({
  postId,
  resourceId: rawResourceId,
  commentsModal = false,
}) => {
  const resourceId = rawResourceId?.replaceAll("/", "");

  const { closeAllModals, closeModal } = useModal();

  const fullScreenActive = useAppSelector(selectSocialFullScreen)?.active;

  const dispatch = useAppDispatch();

  const [navLoading, setNavLoading] = useState(false);

  const [postNavLoading, setPostNavLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    scientific_name: "",
    alternate_names: "",
    images: [],
  });

  const [counts, setCounts] = useState({
    posts: 0,
    experiences: 0,
    votes: 0,
    keepers: 0,
  });

  const [getLiveStockData] = useGetLiveStockPostResourceSummary();

  const handleGetData = async () => {
    const response = await getLiveStockData(resourceId);
    setData(response?.liveStockProfile);
    setCounts(response?.counts);
  };

  useEffect(() => {
    handleGetData();
  }, []);

  // setup animated values for the 4 counts
  const animatedValues = {
    posts: useRef(new Animated.Value(0)).current,
    experiences: useRef(new Animated.Value(0)).current,
    votes: useRef(new Animated.Value(0)).current,
    keepers: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValues.posts, {
        toValue: counts.posts,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.experiences, {
        toValue: counts.experiences,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.votes, {
        toValue: counts.votes,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.keepers, {
        toValue: counts.keepers,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [counts]);

  const useAnimatedCount = (animatedValue) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
      const listener = animatedValue.addListener(({ value }) => {
        setDisplayValue(Math.round(value));
      });
      return () => {
        animatedValue.removeListener(listener);
      };
    }, [animatedValue]);
    return displayValue;
  };

  const handleNavigateToProfile = async () => {
    setNavLoading(true);

    await navigate(`/livestock/${resourceId}`);

    if (fullScreenActive) {
      dispatch(setSocialFullScreen({ active: false }));
    }

    closeAllModals();

    setNavLoading(false);
  };

  const handleNavigateToSimilarPosts = async () => {
    setPostNavLoading(true);

    await navigate(`/social?liveStockId=${resourceId}`);

    if (fullScreenActive) {
      dispatch(setSocialFullScreen({ active: false }));
    }

    closeAllModals();

    setPostNavLoading(false);
  };

  const animatedPosts = useAnimatedCount(animatedValues.posts);
  const animatedVotes = useAnimatedCount(animatedValues.votes);
  const animatedExperiences = useAnimatedCount(animatedValues.experiences);
  const animatedKeepers = useAnimatedCount(animatedValues.keepers);

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Grid direction="column" gap={4}>
          <Grid direction="row" justifyContent="space-between">
            <GridItem style={{ width: "49.5%", marginRight: "1%" }}>
              <Button
                variant="secondary"
                title="Profile"
                onPress={handleNavigateToProfile}
                isLoading={navLoading}
              />
            </GridItem>
            <GridItem style={{ width: "49.5%" }}>
              <Button
                variant="secondary"
                title="Posts"
                onPress={handleNavigateToSimilarPosts}
                isLoading={postNavLoading}
              />
            </GridItem>
          </Grid>

          <Button title="Close" onPress={closeModal} />
        </Grid>
      )}
    >
      <View style={styles.container}>
        <View style={{ marginBottom: 16 }}>
          <LiveStockProfileCarousel images={data?.images} priority="high" />
        </View>
        <Heading variant={4} weight="semiBold">
          {data?.name}
        </Heading>

        <Grid direction="column">
          {data?.alternate_names && <Text>{data?.alternate_names}</Text>}
          <Text>{data?.scientific_name}</Text>
        </Grid>
        <Grid
          direction="row"
          justifyContent="space-between"
          style={{ marginTop: 16 }}
        >
          <Grid direction="column" gap={4} alignItems="center">
            <View style={styles.box}>
              <Text weight="regular" style={{ fontSize: 24 }}>
                {animatedPosts.toString()}
              </Text>
              <Text style={{ fontSize: 10 }}>Posts</Text>
            </View>
          </Grid>
          <Grid direction="column" gap={4} alignItems="center">
            <View style={styles.box}>
              <Text weight="regular" style={{ fontSize: 24 }}>
                {animatedVotes.toString()}
              </Text>
              <Text style={{ fontSize: 10 }}>Votes</Text>
            </View>
          </Grid>
          <Grid direction="column" gap={4} alignItems="center">
            <View style={styles.box}>
              <Text weight="regular" style={{ fontSize: 24 }}>
                {animatedExperiences.toString()}
              </Text>
              <Text style={{ fontSize: 10 }}>Experiences</Text>
            </View>
          </Grid>
          <Grid direction="column" gap={4} alignItems="center">
            <View style={styles.box}>
              <Text weight="regular" style={{ fontSize: 24 }}>
                {animatedKeepers.toString()}
              </Text>
              <Text style={{ fontSize: 10 }}>Keepers</Text>
            </View>
          </Grid>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  box: {
    borderRadius: 8,
    height: 84,
    width: 84,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
    padding: 12,
  },
});
