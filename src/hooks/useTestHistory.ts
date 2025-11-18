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
  const activeTank = useAppSelector(selectActiveTank);

  const dispatch = useAppDispatch();

  const getData = async (month) => {
    const response = await apiClient.post(`/tests`, {
      tankId: activeTank,
      limit: 4,
      month,
    });

    dispatch(setLatestTest(response?.data?.data));
  };

  return useApiRequest(getData);
};

export const useTestHistoryCurrentStanding = () => {
  const activeTank = useAppSelector(selectActiveTank);

  const dispatch = useAppDispatch();

  const getData = async () => {
    const response = await apiClient.post(`/tests/currentStanding`, {
      tankId: activeTank,
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
    tankId,
    referenceIndex,
    limit,
  }: Props) => {
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

export const useDeleteTestHistory = () => {
  const dispatch = useAppDispatch();

  const deleteTestHistory = async (testId) => {
    const response = await apiClient.delete(`/tests/${testId}`);

    if (response?.data) {
      dispatch(removeTestById(testId));
    }

    return response;
  };

  return useApiRequest(deleteTestHistory);
};

export const useDeleteDosageHistory = () => {
  const dispatch = useAppDispatch();

  const deleteDosageHistory = async (dosageId, recordId) => {
    const response = await apiClient.delete(`/dosage/${dosageId}`);

    dispatch(removeDosageById(recordId));

    dispatch(chartRemoveDosageById(recordId));

    return response;
  };

  return useApiRequest(deleteDosageHistory);
};

export const useElements = () => {
  const { isFresh } = useAudience();

  // active key does not exist on things we want to return but things we want to exclude is set to false

  const elements = useAppSelector(selectElements)?.filter(
    (element) => element?.id !== "678150bf2366748b5678e24c" // Exclude Specific Gravity
  );

  if (isFresh) {
    return elements.filter((element) => element?.freshApplicable);
  }

  return elements.filter((element) => !element?.notReefApplicable);
};

export const usePostTestImportCsv = () => {
  const fn = async (payload) => {
    const response = await apiClient.post(
      `/tests/importTestResultCsv`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data?.data;
  };

  return [fn];
};
