import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import {
  signup,
  login,
  getUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/user/:id", authenticateUser, getUser);
userRouter.delete("/user/:id", authenticateUser, deleteUser);

export default userRouter;
