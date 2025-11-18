import apiClient from "../api/apiClient";
import { selectWishList, setWishList } from "../store/slices/wishListSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useAddToWishList = () => {
  const dispatch = useAppDispatch();

  const fn = async (id) => {
    const response = await apiClient.put(
      `/favourites/${id?.replaceAll(":", "")}`,
      {}
    );

    dispatch(setWishList(response.data?.data));
    return true;
  };

  return [fn];
};

export const useSelectWishList = () => {
  const wishList = useAppSelector(selectWishList);

  const corals = wishList.filter((item) => item.plant_coral === true);

  const liveStock = wishList.filter((item) => item.plant_coral !== true);

  return { corals, liveStock };
};

export const useGetWishList = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get("/favourites");

    dispatch(setWishList(response.data?.data));

    return true;
  };

  return [fn];
};

export const useRemoveFromWishList = () => {
  const dispatch = useAppDispatch();

  const fn = async (id) => {
    const response = await apiClient.delete(`/favourites/${id}`);

    dispatch(setWishList(response.data?.data));
    return true;
  };

  return [fn];
};

export const useInWishList = (productId) => {
  const wishList = useAppSelector(selectWishList);

  const isInWishList = wishList?.some((item) => item.id === productId);

  return isInWishList;
};
