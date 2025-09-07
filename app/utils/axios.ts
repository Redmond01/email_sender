import axios from 'axios';


export async function autoRefreshRequest(data:string, apiEndpoint:string) {
  // Create a fresh instance to avoid global interceptor pollution
  const instance = axios.create({ withCredentials: true });
  const refreshTokenRoute = `${process.env.NEXT_PUBLIC_LOGINROUTE}/refresh`
  

  // Set up response interceptor
  instance.interceptors.response.use(
    response => response, // pass through success
    async error => {
      const originalRequest = error.config;

      // Only handle 401 on non-retried requests
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // prevent loop

        try {
          // Call refresh endpoint
          const refreshResponse = await instance.post(refreshTokenRoute);

          // If refresh succeeded (2xx), retry original request
          if (refreshResponse.status >= 200 && refreshResponse.status < 300) {
            return instance(originalRequest); // ← Retry original request
          }

          // If refresh returned 4xx, let it fall through to rejection
        } catch (refreshError) {
          // Refresh failed — reject with refresh error
          return Promise.reject(refreshError);
        }
      }

      // For any other error (including 4xx from refresh), reject
      return Promise.reject(error);
    }
  );

  // Make the original request
  const response = await instance.post(apiEndpoint, data); // assuming POST — adjust if needed

  // Return resolved data
  return response.data;
}