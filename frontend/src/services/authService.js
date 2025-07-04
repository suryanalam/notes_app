import { api } from "./api";

const signup = async (payload) => {
  try {
    const response = await api.post("/auth/signup", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while signup:", error);
    throw error;
  }
};

const login = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response?.data?.data;
  } catch (error) {
    console.log("Error while login:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.put("/auth/logout");
    return response?.data?.data;
  } catch (error) {
    console.log("Error while logout:", error);
    throw error;
  }
};

export { signup, login, logout };
