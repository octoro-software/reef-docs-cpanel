import apiClient from "../api/apiClient";
import { setRecentlyViewed } from "../store/slices/globalSlice";
import { useAppDispatch } from "./useRedux";

export const useGetRecentlyViewed = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get(`/liveStock/recentlyViewed`);

    dispatch(setRecentlyViewed(response.data?.data));
    return true;
  };

  return [fn];
};

export const useAddToRecentlyViewed = () => {
  const dispatch = useAppDispatch();

  const fn = async (id) => {
    const response = await apiClient.post(`/liveStock/recentlyViewed`, {
      liveStockId: id?.replaceAll(":", ""),
    });

    dispatch(setRecentlyViewed(response.data?.data));
    return true;
  };

  return [fn];
};
