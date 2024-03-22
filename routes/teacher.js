var express = require('express');
var router = express.Router();
const {Users: User} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors");
const { validateRole } = require('./middleware/auth');

router.get('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const find = await User.findByPk(req.user.id, {
    attribute: ["email", "isEmailVerified", "fullName"]
  })
    
  return res.status(200).json({
    message: "Teacher retrieved",
    teacher: find
  })
}))
module.exports = router