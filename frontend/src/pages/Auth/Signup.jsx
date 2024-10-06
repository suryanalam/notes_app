import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

import "../../assets/styles/auth.css";
import { CommonContext } from "../../contexts/CommonContext";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { baseUrl } = useContext(CommonContext);

  const onSubmit = async (data) => {
    try {
      const resp = await axios.post(`${baseUrl}/signup`, data);

      if (resp?.data?.data) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-column gap-4 justify-content-start"
      >
        <h4 className="form-tite text-primary">Signup</h4>
        <div className="d-flex flex-column gap-1 justify-content-start">
          <input
            className="input-field"
            type="text"
            pattern="[A-Za-z]+(\s[A-Za-z]+)*"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              min: 3,
            })}
          />
          {errors.username && (
            <p role="alert" className="error-text">
              *{errors.username.message}
            </p>
          )}
        </div>
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
            <p role="alert" className="error-text">
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
              min: 6,
            })}
          />
          {errors.password && (
            <p role="alert" className="error-text">
              *{errors.password.message}
            </p>
          )}
        </div>
        <button type="submit" className="form-btn btn-dark w-100">
          Signup
        </button>
        <NavLink to="/login" className="form-link">
          Have an existing account?
        </NavLink>
      </form>
    </div>
  );
};

export default Signup;
