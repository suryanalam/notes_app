import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Models
import User from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateAccessAndRefreshToken = async (user) => {
  const { _id: id, username, email } = user;

  const accessToken = jwt.sign(
    { id, username, email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" } // 1 hour
  );
  if (!accessToken) return { error: "Error while generating access token" };

  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d", // 7 days
  });
  if (!refreshToken) return { error: "Error while generating refresh token" };

  return { accessToken, refreshToken };
};

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(400, "User already exist");

  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) throw new ApiError(500, "Error while hashing password");

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
  });
  if (!user?._id) throw new ApiError(500, "Error while creating user");

  const data = await generateAccessAndRefreshToken(user);
  if (data?.error) throw new ApiError(500, error);

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { $set: { refreshToken: data?.refreshToken } },
    { new: true }
  );
  if (!updatedUser?.refreshToken) {
    throw new ApiError(500, "Error while adding refresh token into DB");
  }

  // store refresh token in browser cookies
  res.cookie("refreshToken", data?.refreshToken, cookieOptions);
  res.status(201).send(
    new ApiResponse("User created successfully", {
      accessToken: data?.accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill the required details");
  }

  const user = await User.findOne({ email });
  if (!user?._id) throw new ApiError(400, "Invalid Email or Password");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new ApiError(400, "Invalid Email or Password");

  const data = await generateAccessAndRefreshToken(user);
  if (data?.error) throw new ApiError(500, error);

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { $set: { refreshToken: data?.refreshToken } },
    { new: true }
  );
  if (!updatedUser?.refreshToken) {
    throw new ApiError(500, "Error while adding refresh token into DB");
  }

  // store refresh token in browser cookies
  res.cookie("refreshToken", data?.refreshToken, cookieOptions);
  res.status(200).send(
    new ApiResponse("User logged in successfully", {
      accessToken: data?.accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized request");

  const userPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!userPayload?.id) throw new ApiError(401, "Unauthorized request");

  const user = await User.findById(userPayload?.id);
  if (!user?._id || token !== user?.refreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const data = await generateAccessAndRefreshToken(user);
  if (data?.error) throw new ApiError(500, error);

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { $set: { refreshToken: data?.refreshToken } },
    { new: true }
  );
  if (!updatedUser?.refreshToken) {
    throw new ApiError(500, "Error while adding refresh token into DB");
  }

  // store refresh token in browser cookies
  res.cookie("refreshToken", data?.refreshToken, cookieOptions);
  res.status(200).send(
    new ApiResponse("Refreshed user login session", {
      accessToken: data?.accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  if (!user?._id) {
    throw new ApiError(500, "Error while removing refresh token from DB");
  }

  res.status(200).send(new ApiResponse("User logged out successfully"));
});

export { signup, login, logout, refreshAccessToken };
