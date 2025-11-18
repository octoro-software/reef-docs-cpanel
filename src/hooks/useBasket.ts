import apiClient from "../api/apiClient";
import { setBasket } from "../store/slices/basketSlice";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch } from "./useRedux";

export const useBasket = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get("/basket");

    dispatch(setBasket(response?.data?.data));
  };

  return useApiRequest(fn);
};

export const useUpdateBasketQuantity = () => {
  const dispatch = useAppDispatch();

  const fn = async (listingId, quantity) => {
    const response = await apiClient.put(`/basket/${listingId}`, { quantity });

    dispatch(setBasket(response?.data?.data));
  };

  return useApiRequest(fn);
};
