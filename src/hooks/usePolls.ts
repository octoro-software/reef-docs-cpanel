import apiClient from "../api/apiClient";
import { API_BASE_URL } from "../constants";
import { setPollActioned, setPolls } from "../store/slices/pollSlice";
import { useAppDispatch } from "./useRedux";

export const useGetPolls = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get(
      `${API_BASE_URL}/poles?limit=10&outstanding=true`
    );

    if (response?.status === 200) {
      dispatch(setPolls(response?.data?.data));
    }
  };

  return [fn];
};

export const usePostPollResponse = () => {
  const dispatch = useAppDispatch();

  const fn = async (
    poleId: string,
    choiceId?: string,
    freeTextResponse?: string
  ) => {
    const response = await apiClient.post("/poles/vote", {
      poleId,
      choiceId,
      freeTextResponse,
    });

    dispatch(setPollActioned(poleId));

    return response;
  };

  return [fn];
};
