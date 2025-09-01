import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Route middlewares
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import AuthenticateRoutes from "./middlewares/AuthenticateRoutes";

// pages
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Home from "./pages/Home";
import Note from "./pages/Note";
import SharedNote from "./pages/SharedNote";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Authentication Routes */}
        <Route element={<AuthenticateRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

         {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/note/:id" element={<Note />} />
        </Route>

        {/* Public Routes */}
        <Route path="/share/:link" element={<SharedNote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
