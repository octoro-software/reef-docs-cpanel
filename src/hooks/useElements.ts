import apiClient from "../api/apiClient";
import { API_BASE_URL, API_ELEMENTS } from "../constants";

export const useElements = () => {
  const fn = async () => {
    const response = await apiClient
      .get(`${API_BASE_URL}/${API_ELEMENTS}`)
      .catch((error) => {
        return { error: true };
      });

    if (response.error) {
      return response;
    }

    return response?.data?.data;
  };

  return [fn];
};
