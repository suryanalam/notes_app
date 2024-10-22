import { useNavigate } from "react-router-dom";
import "../assets/styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-100 d-flex flex-justify-between flex-align-center">
      <h1 className="logo-text">JOT IT</h1>
      <button className="logout-btn btn-dark" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
