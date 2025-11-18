import React, { Fragment, useEffect } from "react";
import { FlatList, View } from "react-native";
import {
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-native";

import { useAppSelector } from "../../hooks/useRedux";
import { selectPolls } from "../../store/slices/pollSlice";
import PollCard from "../../components/PollCard/PollCard";

import { UserPostCardScreenHeader } from "../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import { NoDataFallbackCard } from "../../elements/NoDataFallbackCard/NoDataFallbackCard";

import { EXPLORE_PATH } from "../../constants";
import { useGetPolls } from "../../hooks/usePolls";

export const PollScreen: React.FC = () => {
  const navigate = useNavigate();

  const [getPolls] = useGetPolls();

  const polls = useAppSelector(selectPolls);

  const handleNavigateExplore = () => navigate(EXPLORE_PATH);

  useRefreshPollsOnLeave();

  useEffect(() => {
    getPolls();
  }, []);

  return (
    <View style={{ marginBottom: 80 }}>
      <FlatList
        renderItem={({ item }) => <PollCard {...item} />}
        data={polls}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        keyExtractor={(item) => item?.id.toString()}
        contentContainerStyle={{ paddingBottom: 200 }}
        ListHeaderComponent={() => (
          <Fragment>
            <UserPostCardScreenHeader title="Polls" icon="reefDocsPolls" />
            <View style={{ height: 10 }} />
          </Fragment>
        )}
      />
      {polls?.length === 0 && (
        <NoDataFallbackCard
          icon="reefDocsPolls"
          title="You have Completed All Polls"
          description="Please check back later for more polls."
          buttonTitle="Explore"
          onPress={handleNavigateExplore}
        />
      )}
    </View>
  );
};

export const useRefreshPollsOnLeave = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [getPolls] = useGetPolls();

  useEffect(() => {
    return () => {
      if (navigationType === "POP" || navigationType === "PUSH") {
        getPolls(); // refresh polls when leaving the page
      }
    };
  }, [location]);
};
