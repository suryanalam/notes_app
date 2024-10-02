import "./Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  let tokenData = localStorage.getItem("token");
  let payload;

  if (tokenData) {
    payload = JSON.parse(atob(tokenData.split(".")[1]));
  }

  const handleLogout = async () => {
    await localStorage.removeItem("token");
    console.log("token from localstorage", localStorage.getItem("token"));
    navigate("/login");
  };

  return (
    <header>
      <h2>JOT IT</h2>
      <section className="header-profile-div">
        <p>Welcome, {payload.name} !!</p>
        <button className="header-login-btn" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </header>
  );
};

export default Header;
