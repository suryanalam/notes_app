import "./Auth.css";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    mail: "",
    password: "",
    mobileNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("form data", user);
    try {
      const userData = await axios.post(
        `https://notes-app-0wxo.onrender.com/signup`,
        user
      );

      if (userData.data.data) {
        console.log("user data from response", userData.data.data);
        navigate("/");
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
          <h1 className="form-title">Signup</h1>
          <form className="auth-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Ex: John Smith"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="mail"
                placeholder="Ex: abc@gmail.com"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Ex: 6 digit password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile No</label>
              <input
                className="form-input"
                type="number"
                name="mobileNo"
                placeholder="Ex: 9876543210"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button className="form-btn" onClick={handleSignup}>
                Signup
              </button>
            </div>
            <div className="form-group">
              <p>
                Already have an account ? <NavLink to="/">login</NavLink>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signup;
