// Utils
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Models
import User from "../models/user.model.js";

const getUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if(!id) throw new ApiError(404, "Invalid user id");

  const user = await User.findById(id).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).send(new ApiResponse("User found successfully", user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if(!id) throw new ApiError(404, "Invalid user id");

  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(500, "Error while deleting user");

  res.status(200).send(new ApiResponse("User deleted successfully"));
});

export { getUser, deleteUser };
