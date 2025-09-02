import "../../assets/styles/auth.css";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// api
import { login } from "../../services/authService";

// store
import { CommonContext } from "../../contexts/CommonContext";

const Login = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { apiInProgress, setApiInProgress, setIsAuthenticated } =
    useContext(CommonContext);

  const onSubmit = async (data) => {
    try {
      setApiInProgress(true);
      const { accessToken, user } = await login(data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      reset();
    }
  };

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-col flex-justify-center gap-4"
      >
        <h1 className="form-title text-center">Welcome Back!</h1>
        <div className="d-flex flex-col gap-2">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="user@gmail.coom"
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
        <div className="d-flex flex-col gap-2">
          <div className="w-100 d-flex flex-align-center flex-justify-between">
            <label htmlFor="password" className="input-label">
              Password
            </label>
          </div>
          <input
            className="input-field"
            type="password"
            placeholder="••••••••••••••••"
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
