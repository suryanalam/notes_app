import { Outlet, Navigate } from "react-router-dom";

// components
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  return token ? (
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
