import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-app-0wxo.onrender.com",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue?.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(accessToken);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get the access token (from localStorage)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("refresh error:", error);
    const originalRequest = error.config;

    // If the error status is 401 and refresh-token attempt is not made
    if (error.response.status === 401 && !originalRequest._retry) {
       console.log("inside refresh error:", error.response.status);
      // store the subsequent failed requests and pause the execution of them until the refresh-token api is fulfilled
      if (isRefreshing) {
        try {
          const accessToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
          `${api.defaults.baseURL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (!response?.data?.data) {
          throw new Error("Error while updating user login session");
        }

        const { user, accessToken } = response.data.data;

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);

        processQueue(null, accessToken); // Resolve all pending requests
        originalRequest.headers.Authorization = `Bearer ${accessToken}`; // set the new token in the headers of orginal request
        return api(originalRequest); // Retry the first request
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
