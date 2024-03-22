var express = require('express');
var router = express.Router();
const {TopicSubscriptions: TopicSubscription, Topics: Topic, Users: User} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors");
const { validateRole } = require('./middleware/auth');

router.get('/topics', validateRole("student"), catchAsyncErrors(async function(req, res, next) {
  const find = await TopicSubscription.findAll({
    where: {
      studentId: req.user.id
    },
    include: {
      model: Topic
    }
    
  })
  console.log(find)
  if (!find || find.length === 0) {
    return res.status(200).json({
      message: "You have not yet been assigned a topic",
      topics: []
    })
  }
  return res.status(200).json({
    message: "Topics retrieved",
    topics: find
  })
}))


router.get('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const find = await User.findAll({
    where: {
      role: "student",
    },
    attributes: ["id", "email", "fullName", 'isEmailVerified']
  })
  return res.status(200).json({
    students: find
  })
}))

module.exports = router