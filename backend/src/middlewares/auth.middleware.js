import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

  if (!token) {
    
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user; // add user data to request
    next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      throw new ApiError(401, "Unauthorized request");
    } else {
      throw new ApiError(500, "Internal server error");
    }
  }
};

export default authenticateUser;
