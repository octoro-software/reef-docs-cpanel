import apiClient from "../api/apiClient";
import { setPartners } from "../store/slices/globalSlice";
import { useAppDispatch } from "./useRedux";

export const useGetPartners = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get(`/partners`);

    const data = response?.data?.map((item) => ({
      ...item,
      images: [
        {
          url: item.logo,
        },
      ],
    }));

    dispatch(setPartners(data));
  };

  return [fn];
};
