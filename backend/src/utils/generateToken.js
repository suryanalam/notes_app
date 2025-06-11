import jwt from "jsonwebtoken";

const generateToken = (payload, expireTime) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: expireTime,
  });

  return token;
};

export default generateToken;
