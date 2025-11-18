import { useDispatch } from "react-redux";
import apiClient from "../api/apiClient";
import { useApiRequest } from "./useApiRequest";
import { setGameLeaderboard } from "../store/slices/globalSlice";
import { useEffect } from "react";

export const useSubmitLeaderboardEntry = () => {
  const [requestLeaderboard] = useRequestLeaderboard();

  const fn = async (data) => {
    const response = await apiClient.post("games/leaderboard", data);

    await requestLeaderboard(data.gameId);

    return response.data;
  };

  return useApiRequest(fn);
};

export const useRequestLeaderboard = () => {
  const dispatch = useDispatch();

  const fn = async (gameId) => {
    const response = await apiClient.get(`games/leaderboard/${gameId}`);

    dispatch(setGameLeaderboard(response?.data?.data));

    return response.data;
  };

  return [fn];
};

export const useGetLeaderboard = (gameId) => {
  const [requestLeaderboard] = useRequestLeaderboard();

  const fn = async () => await requestLeaderboard(gameId);

  useEffect(() => {
    fn();
  }, []);
};
