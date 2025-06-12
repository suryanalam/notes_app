import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

// store
import { CommonContext } from "../contexts/CommonContext";

const AuthenticateRoutes = () => {
  const { isAuthenticated } = useContext(CommonContext);
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default AuthenticateRoutes;
