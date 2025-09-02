import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("Unauthorized request");

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!user) throw new Error("Unauthorized request");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({
      success: false,
      message: err.message || "Error while authenticating user",
      data: null,
    });
  }
};

export default authenticateUser;
