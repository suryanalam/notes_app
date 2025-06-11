import express from "express";
import { getUser, deleteUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/user/:id", getUser);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;
