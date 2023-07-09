import "./Auth.css";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [loginCredentials, setLoginCredentials] = useState({
    mail: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("form data", loginCredentials);

    try {
      const loginData = await axios.post(
        `https://notes-app-0wxo.onrender.com/login`,
        loginCredentials
      );

      console.log("login data from response", loginData);

      if (loginData.data.token) {
        console.log("token from response", loginData.data.token);
        localStorage.setItem("token", loginData.data.token);
        console.log("token from localstorage", localStorage.getItem("token"));
        navigate("/");
      } else {
        alert("Enter the required fields");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="auth-bg">
      <section className="auth-left-bg">
        <img
          className="auth-left-bg-img"
          src={process.env.PUBLIC_URL + "/assets/images/form.jpg"}
          alt="form-icon"
        />
      </section>
      <section className="auth-right-bg">
        <div className="auth-form-bg">
          <h1 className="form-title">Login</h1>
          <form className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                name="mail"
                type="email"
                placeholder="Ex: abc@gmail.com"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                placeholder="Ex: 6 digit password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button className="form-btn" onClick={handleLogin}>
                Login
              </button>
            </div>
            <div className="form-group">
              <p>
                <NavLink to="/forgotpassword">Forgot Password </NavLink>
              </p>
              <p>
                Don't have an account ? <NavLink to="/signup">signup</NavLink>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
