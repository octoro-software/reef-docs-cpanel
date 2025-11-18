import { useState, useCallback, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";

type ApiFunction<T, R = AxiosResponse<T>> = (...args: any[]) => Promise<R>;

export const useApiRequest = <T, R = AxiosResponse<T>>(
  apiFunction: ApiFunction<T, R>
): [
  (...args: Parameters<ApiFunction<T, R>>) => Promise<R>,
  boolean,
  string | null,
  boolean
] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const request = useCallback(
    async (...args: Parameters<ApiFunction<T, R>>): Promise<R> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await apiFunction(...args);
        setSuccess(true);
        return response;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.response?.data?.message || "An error occurred");
        throw axiosError; // Rethrow for further handling
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  // Reset error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer); // Cleanup function
    }
  }, [error]);

  return [request, loading, error, success];
};
