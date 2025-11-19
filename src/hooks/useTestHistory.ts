import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";
import { selectElements } from "../store/slices/IcpSlice";
import { selectActiveTank } from "../store/slices/tankSlice";
import {
  chartRemoveDosageById,
  removeDosageById,
  removeTestById,
  setCurrentStanding,
  setLatestTest,
  setTestSelectionIndex,
} from "../store/slices/testingSlice";
import { useApiRequest } from "./useApiRequest";
import { useAudience } from "./useAudience";
import { useAppDispatch, useAppSelector } from "./useRedux";

type Props = {
  type: "home" | "all" | "icp";
  date?: string;
  historic?: boolean;
  tankId: string;
  referenceIndex?: boolean;
  limit?: number;
};

export const useTestHistoryForTank = () => {
  const dispatch = useAppDispatch();

  const getData = async (month) => {
    const tankId = await AsyncStorage.getItem("tankId");

    const response = await apiClient.post(`/tests`, {
      tankId: tankId,
      limit: 4,
      month,
    });

    dispatch(setLatestTest(response?.data?.data));
  };

  return useApiRequest(getData);
};

export const useTestHistoryCurrentStanding = () => {
  const dispatch = useAppDispatch();

  const getData = async () => {
    const tankId = await AsyncStorage.getItem("tankId");

    const response = await apiClient.post(`/tests/currentStanding`, {
      tankId: tankId,
    });

    dispatch(setCurrentStanding(response?.data?.data));
  };

  return useApiRequest(getData);
};

export const useGetTestHistory = () => {
  const dispatch = useAppDispatch();

  const getTestHistory = async ({
    type,
    date,
    historic,
    referenceIndex,
    limit,
  }: Props) => {
    const tankId = await AsyncStorage.getItem("tankId");

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
