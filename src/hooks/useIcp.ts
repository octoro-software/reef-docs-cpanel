import apiClient from "../api/apiClient";
import { useAppDispatch } from "./useRedux";

import { setElements, setIcpProviders } from "../store/slices/IcpSlice";

import { API_BASE_URL, API_ELEMENTS, API_ICP_PROVIDERS } from "../constants";

export const useIcpProviders = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient
      .get(`${API_BASE_URL}/${API_ICP_PROVIDERS}`)
      .catch((error) => {
        return { error: true };
      });

    if (response.error) {
      return response;
    }

    dispatch(setIcpProviders(response?.data?.data));
  };

  return [fn];
};

export const useElements = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient
      .get(`${API_BASE_URL}/${API_ELEMENTS}`)
      .catch((error) => {
        return { error: true };
      });

    if (response.error) {
      return response;
    }

    dispatch(setElements(response?.data?.data));
  };

  return [fn];
};
