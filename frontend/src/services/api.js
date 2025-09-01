import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-app-0wxo.onrender.com/api",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue?.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and not an attempt to refresh token already
    if (error.response.status === 401 && !originalRequest._retry) {
      // store the subsequent failed requests and pause the execution of them until the refresh-token api is fulfilled
      if (isRefreshing) {
        try {
          const newAccessToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry the pending request
        } catch (err) {
          return Promise.reject(err); // Reject the pending request
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh token api
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (!response?.data?.data) {
          throw new Error("Error while updating user login session");
        }

        const { user, accessToken: newAccessToken } = response.data.data;

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("accessToken", newAccessToken);

        processQueue(null, newAccessToken); // Resolve all pending requests
        return api(originalRequest); // Retry the first request with the new access token
      } catch (refreshError) {
        // logout user
        localStorage.removeItem("currentUser");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        processQueue(refreshError); // Reject all pending requests
        return Promise.reject(refreshError); // Retry the first request
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
