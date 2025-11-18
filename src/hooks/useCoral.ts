import apiClient from "../api/apiClient";

import { API_LIVESTOCK } from "../constants";
import {
  setPlantCoralListing,
  setPlantCoralProfile,
} from "../store/slices/coralPlantSlice";

import { LiveStockListingApiResponse } from "../types/api/liveStock.types";
import { LiveStockProfileApiResponse } from "../types/api/liveStockProfile.types";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch } from "./useRedux";

export const usePlantCoralListing = () => {
  const dispatch = useAppDispatch();
  21;
  const fn = async ({ filterQuery }) => {
    const queryString = filterQuery.startsWith("?")
      ? filterQuery
      : `?${filterQuery}`;

    const response = await apiClient.get(
      `${API_LIVESTOCK}${queryString}&coral=true`
    );

    const data: LiveStockListingApiResponse = response?.data;

    dispatch(setPlantCoralListing(data));

    return data;
  };

  return useApiRequest(fn);
};

export const useGetPlantCoralProfile = () => {
  const dispatch = useAppDispatch();
  const fn = async (id: string) => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/${id?.replace(":", "")}?coral=true`
    );

    const data: LiveStockProfileApiResponse = response?.data;

    dispatch(setPlantCoralProfile(response?.data?.data));

    return data;
  };

  return [fn];
};
