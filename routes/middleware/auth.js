const { jwtSecret } = require("../../config");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../../utils/errors");

module.exports.authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  jwt.verify(token, jwtSecret, (err, info) => {
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