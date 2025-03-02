import jwt from "jsonwebtoken";

// utils
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler.js";

const authenticateUser = asyncHandler((req, res, next) => {
  const token = req.headers?.authorization?.replace("Bearer ", "");
  if (!token) return new ApiError(401, 'Unauthorized request !!');

  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!user) return new ApiError(401, 'Invalid token !!');

  req.user = user;
  next();
});

export default authenticateUser;
