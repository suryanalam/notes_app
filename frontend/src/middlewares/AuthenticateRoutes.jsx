import { Outlet, Navigate } from "react-router-dom";

const AuthenticateRoutes = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default AuthenticateRoutes;
