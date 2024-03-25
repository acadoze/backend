var express = require('express');
var router = express.Router();
const {Users} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors")

router.get('/', catchAsyncErrors(async function(req, res, next) {
  const {id} = req.user
  const find = await Users.findByPk(id, {
  	attributes: ["id", "fullName", "email", "isEmailVerified", "role", "imgPath", "createdAt"]
  })
  return res.status(200).json({
    message: "Profile retrieved",
    profile: find
  })
}))




module.exports = router;
