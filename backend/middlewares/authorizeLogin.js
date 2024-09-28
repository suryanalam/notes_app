/* This miidleware is used to authenticate whether the user is logged in or not
If logged in, user can access the routes, else user will be redirected to login page */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeLogin = (req, res, next) => {
  let token = req.headers.authorization;
  

  if (!token) {
    return res.status(500).send({
      message: "you are not logged in !!",
    });
  }

  try {
    let tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!tokenData) {
      return res.status(500).send({
        message: "Invalid Token !!",
      });
    }

    

    req.user = tokenData;

    next();
  } catch (err) {
    return res.status(401).send({
      message: "Invalid Token !!",
    });
  }
};

module.exports = authorizeLogin;
