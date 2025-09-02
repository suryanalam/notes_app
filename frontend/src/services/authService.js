import { api } from "./api";

const signup = async (payload) => {
  try {
    const response = await api.post("/api/auth/signup", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while signup:", error);
    throw error;
  }
};

const login = async (payload) => {
  try {
    const response = await api.post("/api/auth/login", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while login:", error);
    throw error;
  }
};

const forgotPassword = async (payload) => {
  try {
    const response = await api.post("/api/auth/forgot-password", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while forgot password:", error);
    throw error;
  }
};

const resetPassword = async (payload) => {
  try {
    const response = await api.post("/api/auth/reset-password", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while reset password:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.put("/api/auth/logout");
    return response?.data?.data;
  } catch (error) {
    console.log("Error while logout:", error);
    throw error;
  }
};

export { signup, login, forgotPassword, resetPassword, logout };
