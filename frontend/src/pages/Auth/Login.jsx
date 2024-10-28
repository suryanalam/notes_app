import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

import "../../assets/styles/auth.css";
import { CommonContext } from "../../contexts/CommonContext";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { baseUrl, setToken } = useContext(CommonContext);

  const onSubmit = async (data) => {
    try {
      const resp = await axios.post(`${baseUrl}/login`, data);

      if (resp?.data?.token) {
        localStorage.setItem("token", resp.data.token);
        const token = localStorage.getItem("token");
        setToken(token);
        navigate("/");
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-column gap-4 justify-content-center"
      >
        <h1 className="form-tite text-primary text-center">Login</h1>
        <div className="d-flex flex-column gap-1 justify-content-start">
          <input
            className="input-field"
            type="email"
            pattern="[A-Za-z0-9]+@[A-Za-z]+.[A-za-z]{2,3}"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p role="alert" className="text-red">
              *{errors.email.message}
            </p>
          )}
        </div>
        <div className="d-flex flex-column gap-1 justify-content-start">
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p role="alert" className="text-red">
              *{errors.password.message}
            </p>
          )}
        </div>
        <button type="submit" className="form-btn btn-dark w-100">
          Login
        </button>
        <NavLink to="/signup" className="form-link">
          Create a new account
        </NavLink>
      </form>
    </div>
  );
};

export default Login;
