import axios from "axios";
import { attachAuthToken } from "./requestInterceptor";
import { handleResponseError } from "./responseInterceptor";

const apiClient = axios.create({
  timeout: 20000,
});

// Attach the access token to all requests
apiClient.interceptors.request.use(attachAuthToken, (error) =>
  Promise.reject(error)
);

// Handle responses and refresh tokens
apiClient.interceptors.response.use(
  (response) => response,
  (err) => handleResponseError(err)
);

export default apiClient;
