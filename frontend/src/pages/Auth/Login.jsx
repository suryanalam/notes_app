import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// styles
import "../../assets/styles/auth.css";

// store
import { CommonContext } from "../../contexts/CommonContext";

const Login = () => {
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
        setToken(resp.data.token);
      } else {
        toast.error("Login Failed");
      }
    } catch (err) {
      console.log("Error while Login: ", err);
      toast.error(err?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-column gap-4 justify-content-center"
      >
        <h1 className="form-tite text-primary text-center">Welcome Back!</h1>
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
        <div className="w-100">
         <span className="form-link-text">Don't have an account?</span>
          <NavLink to="/signup" className="form-link">
            Create
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;
