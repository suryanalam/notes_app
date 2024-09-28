const {
  signupUser,
  loginUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const authorizeLogin = require("../middlewares/authorizeLogin");


const express = require("express");
const userRouter = express.Router();

userRouter.post("/login", loginUser); // login User
userRouter.post("/signup", signupUser); // signup User


userRouter.get("/user/:id", authorizeLogin, getUser); // get User by id
userRouter.put("/user/:id", authorizeLogin, updateUser); // update User by id
userRouter.delete("/user/:id", authorizeLogin, deleteUser); // delete User by id

module.exports = userRouter;