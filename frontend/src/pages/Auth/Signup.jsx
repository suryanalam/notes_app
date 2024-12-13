import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// styles
import "../../assets/styles/auth.css";

// store
import { CommonContext } from "../../contexts/CommonContext";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { baseUrl } = useContext(CommonContext);

  const onSubmit = async (data) => {
    try {
      const resp = await axios.post(`${baseUrl}/signup`, data);
      if (resp?.data?.data) {
        toast.success("Your Account is created Successfully");
        navigate('/login');
      } else {
        toast.error("Signup Failed");
      }
    } catch (err) {
      console.log("Error while Signup: ", err);
      toast.error(err?.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-column gap-4 justify-content-center"
      >
        <h1 className="form-tite text-primary text-center">Create an Account</h1>
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
            <p role="alert" className="text-red">
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
              min: 6,
            })}
          />
          {errors.password && (
            <p role="alert" className="text-red">
              *{errors.password.message}
            </p>
          )}
        </div>
        <button type="submit" className="form-btn btn-dark w-100">
          Signup
        </button>
        <div className="w-100">
          <span className="form-link-text">Have an existing account?</span>
          <NavLink to="/login" className="form-link">
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Signup;
