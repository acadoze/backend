var express = require('express');
var router = express.Router();
const {Users: User} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors")
const jwt = require("jsonwebtoken")

router.post('/', catchAsyncErrors(async function(req, res, next) {
  const {email, password, fullName} = req.body
  const {role} = req.query
  if (!email || !password || !role || !fullName || !["student", "teacher"].includes(role)) {
    return next(new ApiError("Please complete your form", 400));
  };

  const findEmail = await User.findOne({where: {email}})
  if (findEmail) {
    return next(new ApiError("Email already exists", 400));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await User.create({
    email, fullName, role, password: hash
  })
  return res.status(201).json({
    success: true, message: "Account registration successful. Proceed to log in"
  })
}));

router.delete('/', (req, res) => {
  res.cookie("token", "")
})

router.put('/', catchAsyncErrors(async function (req, res, next) {
  const {email, password} = req.body
  const {role} = req.query
  if (!email || !password || !["student", "teacher"].includes(role)) {
    return next(new ApiError("Please fill in the form", 400));
  }
  const user = await User.findOne({where: {email, role}, attributes: ["password", "id", "role"]})

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new ApiError("Invalid email address", 400));
  }
  const token = await createJwtToken({
    id: user.id,
    role: user.role
  });
  return res.status(200).json({
    success: true,
    message: "You are now logged in",
    data: {
      authToken: token
    },
  })
}))

async function createJwtToken({id, role}) {
  const maxAge = "300000 mins";
  return await jwt.sign(
    {id, role},
    JWT_SECRET,
    { expiresIn: maxAge },
  );
}

module.exports = router;
