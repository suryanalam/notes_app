import "../../assets/styles/auth.css";
import { useContext, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// api
import { forgotPassword } from "../../services/authService";

// store
import { CommonContext } from "../../contexts/CommonContext";

const ForgotPassword = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams] = useSearchParams();

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { apiInProgress, setApiInProgress } = useContext(CommonContext);

  const onSubmit = async (data) => {
    setApiInProgress(true);
    try {
      await forgotPassword(data);
      navigate("/login");
      toast.success(
        "Please check your registered email to reset a new password"
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApiInProgress(false);
      reset();
    }
  };

  useEffect(() => {
    if (searchParams.get("email")) {
      setValue("email", searchParams.get("email"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-bg d-grid grid-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container d-flex flex-col gap-4"
      >
        <h1 className="form-title text-center">Forgot Password</h1>
        <span className="input-label">
          Please verify your registered email address. You will receive an email
          to reset the password.
        </span>
        <div className="d-flex flex-col gap-2">
          <input
            className="input-field"
            type="email"
            placeholder="user@gmail.com"
            disabled={apiInProgress}
            {...register("email", {
              required: "user@gmail.com",
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
        <button
          type="submit"
          className="form-btn btn-dark w-100"
          disabled={apiInProgress}
        >
          Verify
        </button>
        <div className="w-100">
          <NavLink to="/login" className="form-link">
            Go back to Login
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
