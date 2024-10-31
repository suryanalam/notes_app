import { Outlet, Navigate } from "react-router-dom";

// components
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";

const Authenticate = () => {
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

export default Authenticate;
