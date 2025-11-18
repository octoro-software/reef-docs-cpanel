export const logError = (error) => {
  if (error.response) {
    if (error.status === 401) return;

    console.error("API Error:", {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Axios error:", error.message);
  }
};
