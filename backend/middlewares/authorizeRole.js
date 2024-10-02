/* This miidleware is used to authorize whether the user is admin or not
If yes, user can access the authorized routes like 'getAllUser' */

const authorizeRole = (req, res, next) => {
  const tokenData = req.user;

  if (tokenData.role !== "admin") {
    res.status(500).send({
      message: "you are not authorized to access this route !!",
    });
  }

  next();
};

module.exports = authorizeRole;
