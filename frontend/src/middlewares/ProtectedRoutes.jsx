import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

// components
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";

// store
import { CommonContext } from "../contexts/CommonContext";

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
