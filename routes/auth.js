var express = require('express');
var router = express.Router();
const {User} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config")

router.post('/', async function(req, res, next) {
  const {email, password, role, fullName} = req.body
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false, message: "Invalid request body"
    })
  };
  
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  await User.create({
    email, fullName, role, password: hash
  })
  return res.status(201).json({
    success: true, message: "Account registration successful"
  })
});

router.put('/', async function (req, res) {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(200).json({
      success: false, message: "Invalid request body"
    })
  }
  const user = await User.findOne({where: {email}, attributes: ["password", "id", "role"]})

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.json({
      success: false, message: "Invalid email address"
    }, {status: 401})
  }
  const token = await createJwtToken({
    id: user.id,
    role: user.role
  });
  res.cookie("token", token, {
    signed: true,
    path: "/learn",
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV !== "development",
  });
  return res.status(200).json({
    success: true,
    message: "You are now logged in",
    data: {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
    },
  })
})

async function createJwtToken({id, role}) {
  const maxAge = "30 mins";
  return await jwt.sign(
    {id, role},
    JWT_SECRET,
    { expiresIn: maxAge },
  );
}

module.exports = router;
