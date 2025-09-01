import "../../assets/styles/auth.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// api
import { resetPassword } from "../../services/authService";

// store
import { CommonContext } from "../../contexts/CommonContext";

const ResetPassword = () => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const watchPassword = watch("password");
  const navigate = useNavigate();

  const { apiInProgress, setApiInProgress, setIsAuthenticated } =
    useContext(CommonContext);

  const onSubmit = async (data) => {
    setApiInProgress(true);
    try {
      const { user, accessToken } = await resetPassword({
        password: data?.password,
      });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
      navigate("/");
      toast.success("Password updated successfully");
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
        <h1 className="form-title text-center">Reset Password</h1>
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
        <div className="d-flex flex-col gap-2">
          <label htmlFor="password" className="input-label">
            Confirm Password
          </label>
          <input
            className="input-field"
            type="password"
            placeholder="••••••••••••••••"
            disabled={apiInProgress}
            {...register("confirmPassword", {
              required: "Password need to be confirmed",
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_#-])[A-Za-z\d@$!%*?&_#-]{8,20}$/,
                message:
                  "Password must be 8-20 characters long, include uppercase, lowercase, number, and a special character.",
              },
              validate: (value) =>
                value === watchPassword || "The passwords do not match",
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
          {errors.confirmPassword && (
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
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
