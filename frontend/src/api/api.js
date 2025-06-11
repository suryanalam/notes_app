import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
        console.log("refreshing...");
        try {
          const newAccessToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            console.log("queue: ", failedQueue);
          });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("retry...");
          return api(originalRequest); // Retry the pending request
        } catch (err) {
          console.log("catch...");
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
          throw new Error(
            "Response not found while updating user login session"
          );
        }

        const {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = response.data.data;

        localStorage.setItem("currentUser", user);
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        processQueue(null, newAccessToken); // Resolve all pending requests
        return api(originalRequest); // Retry the first request with the new access token
      } catch (refreshError) {
        // logout user
        localStorage.removeItem("currentUser");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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

// Generic API Request Wrapper
export const Api = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  delete: (url) => api.delete(url),
};

export default api;
