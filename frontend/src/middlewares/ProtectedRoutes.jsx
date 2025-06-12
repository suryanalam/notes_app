import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

// store
import { CommonContext } from "../contexts/CommonContext";

// components
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useContext(CommonContext);
  return isAuthenticated ? (
    <>
      <Header />
      <Outlet />
      <NoteForm />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
