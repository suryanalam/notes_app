import express from "express";
import {
  login,
  signup,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.put("/logout", authenticateUser, logout);

export default authRouter;
