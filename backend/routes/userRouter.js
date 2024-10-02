import express from "express";
import authorizeLogin from "../middlewares/authorizeLogin.js";
import {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

// create a user router instance
const userRouter = express.Router();

userRouter.post("/login", login); // login User
userRouter.post("/signup", signup); // signup User
userRouter.get("/user/:id", authorizeLogin, getUser); // get User by id
userRouter.put("/user/:id", authorizeLogin, updateUser); // update User by id
userRouter.delete("/user/:id", authorizeLogin, deleteUser); // delete User by id

export default userRouter;
