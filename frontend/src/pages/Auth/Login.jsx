import "../../assets/styles/auth.css";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";

// store
import { CommonContext } from "../../contexts/CommonContext";

const Login = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login,apiInProgress } = useContext(CommonContext);

  const onSubmit = async (data) => {
    await login(data);
    reset();
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
            placeholder="Email"
            disabled={apiInProgress}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
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
            disabled={apiInProgress}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_#-])[A-Za-z\d@$!%*?&_#-]{8,20}$/,
                message:
                  "Password must be 8-20 characters long, include uppercase, lowercase, number, and a special character.",
              },
            })}
          />
          {errors.password && (
            <p role="alert" className="text-red">
              *{errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="form-btn btn-dark w-100"
          disabled={apiInProgress}
        >
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
