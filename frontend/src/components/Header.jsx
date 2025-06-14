import "../assets/styles/header.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// api
import { logout } from "../../services/authService";

// store
import { CommonContext } from "../contexts/CommonContext";

const Header = () => {
  const navigate = useNavigate();

  const {
    apiInProgress,
    setApiInProgress,
    isAuthenticated,
    resetStore,
  } = useContext(CommonContext);

  const handleLogout = async () => {
    setApiInProgress(true);
    try {
      await logout();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      resetStore();
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <header className="w-100 d-flex flex-justify-between flex-align-center">
      <h1 className="logo-text cursor-pointer" onClick={() => navigate("/")}>
        JotIt
      </h1>
      {isAuthenticated ? (
        <button
          className="logout-btn btn-dark"
          disabled={apiInProgress}
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          className="logout-btn btn-dark"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
