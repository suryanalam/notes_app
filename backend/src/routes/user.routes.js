import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

// create a user router instance
const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/user/:id", authenticateUser, getUser);
userRouter.put("/user/:id", authenticateUser, updateUser);
userRouter.delete("/user/:id", authenticateUser, deleteUser);

export default userRouter;
