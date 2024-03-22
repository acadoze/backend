const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");
const ApiError = require("../../utils/errors");

module.exports.authenticateUser = async (req, res, next) => {
  const auth = req.headers?.authorization
  if (!auth) {
    return next(new ApiError("Please login to access this resource", 401));
  }
  const token = auth.split(' ')[1]
  if (!token) {
    return next(new ApiError("Please login to access this resource", 401));
  }

  jwt.verify(token, JWT_SECRET, (err, info) => {
    try {
      if (err) {
        return next(new ApiError("Please login to access this resource", 401));
      } 
      req.user = {
        id: info.id,
        role: info.role,
      };
      return next();
    } catch (err) {
      return next(new ApiError("Invalid token", 401));
    }
  });
};

module.exports.validateRole = (roles) => {
  return function (req, res, next) {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return next(new ApiError("You can't access this route", 401));
    }
    next();
  };
};
