import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";

import {
  setAquaDocsFeedSyncing,
  setCurrentStanding,
  setCurrentStandingStability,
  setTestSelectionIndex,
} from "../store/slices/testingSlice";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  selectActiveTankId,
  selectAquaDocsFeed,
} from "../store/slices/userConfigSlice";
import { useEffect } from "react";

type Props = {
  type: "home" | "all" | "icp";
  date?: string;
  historic?: boolean;
  tankId: string;
  referenceIndex?: boolean;
  limit?: number;
};

export const useTestHistoryCurrentStanding = () => {
  const dispatch = useAppDispatch();
  const tankId = useAppSelector(selectActiveTankId);

  const getData = async (stability = false) => {
    if (!tankId) return;

    const stabilityFormula = await AsyncStorage.getItem("stabilityFormula");

    dispatch(setAquaDocsFeedSyncing(true));

    const response = await apiClient.post(
      stability
        ? `/tests/currentStanding?cpanel=true&stabilityFormula=${stabilityFormula ?? "cv"}`
        : `/tests/currentStanding?cpanel=true`,
      {
        tankId: tankId,
      }
    );

    dispatch(
      stability
        ? setCurrentStandingStability(response?.data?.data)
        : setCurrentStanding(response?.data?.data)
    );

    dispatch(setAquaDocsFeedSyncing(false));
  };

  return useApiRequest(getData);
};

export const useAutoAquaDocsStabilityFeed = () => {
  const aquaDocsFeed = useAppSelector(selectAquaDocsFeed);

  const [getFeed] = useTestHistoryCurrentStanding();

  const refreshTime = aquaDocsFeed?.refreshTime;

  useEffect(() => {
    if (!refreshTime) return;

    const interval = setInterval(
      () => {
        getFeed(true);
      },
      (refreshTime || 5) * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [refreshTime]);
};

export const useAutoAquaDocsParamFeed = () => {
  const aquaDocsFeed = useAppSelector(selectAquaDocsFeed);

  const [getFeed] = useTestHistoryCurrentStanding();

  const refreshTime = aquaDocsFeed?.refreshTime;

  useEffect(() => {
    getFeed();
  }, []);

  useEffect(() => {
    if (!refreshTime) return;

    const interval = setInterval(
      () => {
        getFeed();
      },
      (refreshTime || 5) * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [refreshTime]);
};

export const useGetTestHistory = () => {
  const dispatch = useAppDispatch();
  const tankId = useAppSelector(selectActiveTankId);

  const getTestHistory = async ({
    type,
    date,
    historic,
    referenceIndex,
    limit,
  }: Props) => {
    if (!tankId) return;
    const response = await apiClient.post("/tests", {
      type,
      date,
      historic,
      tankId,
      referenceIndex,
      limit,
    });

    const data = response?.data?.data;

    dispatch(setTestSelectionIndex(data));

    return data;
  };

  return [getTestHistory];
};
