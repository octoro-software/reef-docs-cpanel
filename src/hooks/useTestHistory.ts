import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";
import { selectElements } from "../store/slices/IcpSlice";
import { selectActiveTank } from "../store/slices/tankSlice";
import {
  chartRemoveDosageById,
  removeDosageById,
  removeTestById,
  setCurrentStanding,
  setCurrentStandingStability,
  setLatestTest,
  setTestSelectionIndex,
} from "../store/slices/testingSlice";
import { useApiRequest } from "./useApiRequest";
import { useAudience } from "./useAudience";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { selectActiveTankId } from "../store/slices/userConfigSlice";

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

  const tankId = useAppSelector(selectActiveTankId);

  const getData = async (month) => {
    if (!tankId) return;

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
  const tankId = useAppSelector(selectActiveTankId);

  const getData = async (stability = false) => {
    if (!tankId) return;

    const stabilityFormula = await AsyncStorage.getItem("stabilityFormula");

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
  };

  return useApiRequest(getData);
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
