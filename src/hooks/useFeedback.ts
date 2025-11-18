import apiClient from "../api/apiClient";

export const usePostFeedback = () => {
  const fn = async (data: any) => {
    const response = await apiClient.post("/feedback", data);

    if (response?.status === 200) {
      return response;
    }
  };

  return [fn];
};
