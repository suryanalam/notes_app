import "../../assets/styles/auth.css";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// api
import { signup } from "../../services/authService";

// store
import { CommonContext } from "../../contexts/CommonContext";

const Signup = () => {
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
      const { accessToken, user } = await signup(data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
      navigate("/");
      toast.success("Your account is created successfully");
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
        className="form-container d-flex flex-col gap-4"
      >
        <h1 className="form-title text-center">Create an Account</h1>
        <div className="d-flex flex-col gap-2">
          <label htmlFor="username" className="input-label">
            Username
          </label>
          <input
            className="input-field"
            type="text"
            placeholder="surya"
            disabled={apiInProgress}
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-z][a-z0-9_]{2,15}$/,
                message:
                  "Username must start with a letter and contain only lower case letters, numbers and underscore.",
              },
              minLength: {
                value: 3,
                message: "Username must contain atleast 3 characters.",
              },
              maxLength: {
                value: 16,
                message:
                  "Username must contain less than or equal to 16 characters.",
              },
            })}
          />
          {errors.username && (
            <p role="alert" className="text-red">
              *{errors.username.message}
            </p>
          )}
        </div>
        <div className="d-flex flex-col gap-2">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="user@gmail.com"
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
          <label htmlFor="password" className="input-label">
            Password
          </label>
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
              minLength: {
                value: 8,
                message: "Password must contain atleast 8 characters.",
              },
              maxLength: {
                value: 20,
                message:
                  "Password must contain less than or equal to 20 characters.",
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
