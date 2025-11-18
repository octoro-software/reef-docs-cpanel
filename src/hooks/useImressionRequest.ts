import apiClient from "../api/apiClient";

export const useImpressRequest = () => {
  const fn = async ({ location, promo }) => {
    await apiClient.post("/impression", {
      location,
      promo,
    });
  };

  return [fn];
};
