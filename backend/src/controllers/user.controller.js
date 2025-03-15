import bcrypt from "bcrypt";

// Models
import User from "../models/user.model.js";

// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    throw new ApiError(500, "Error while hashing password");
  }

  const newUser = {
    username: username.toLowerCase(),
    password: hashedPassword,
    email,
  };
  const user = await User.create(newUser);
  if (!user) {
    throw new ApiError(500, "Error while creating user");
  }

  res.status(201).send(new ApiResponse("User created successfully", user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid Email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Email or password");
  }

  const accessTokenPayload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  const accessToken = generateToken(accessTokenPayload, "1d");
  if (!accessToken) {
    throw new ApiError(500, "Error while generating access token");
  }

  const refreshTokenPayload = { id: user._id };
  const refreshToken = generateToken(refreshTokenPayload, "7d");
  if (!refreshToken) {
    throw new ApiError(500, "Error while generating refresh token");
  }

  user.refreshToken = refreshToken;
  const updatedUser = await user.save();
  if (!updatedUser?.refreshToken) {
    throw new ApiError(500, "Error while adding refresh token into DB");
  }

  res
    .status(200)
    .send(
      new ApiResponse("User logged in successfully", {
        accessToken,
        refreshToken,
      })
    );
});

const getUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).send(new ApiResponse("User found successfully", user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new ApiError(500, "Error while deleting user");
  }

  res.status(200).send(new ApiResponse("User deleted successfully", user));
});

export { login, signup, getUser, deleteUser };
