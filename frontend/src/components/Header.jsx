import "../assets/styles/header.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// store
import { CommonContext } from "../contexts/CommonContext";

const Header = () => {
  const navigate = useNavigate();
  const { resetStore, isAuthenticated } = useContext(CommonContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    resetStore();
    navigate("/login");
  };

  return (
    <header className="w-100 d-flex flex-justify-between flex-align-center">
      <h1 className="logo-text cursor-pointer" onClick={() => navigate("/")}>
        Jotit
      </h1>
      {!isAuthenticated ? (
        <button
          className="logout-btn btn-dark"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      ) : (
        <button className="logout-btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
