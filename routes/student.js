var express = require('express');
var router = express.Router();
const {TopicSubscriptions, Topics, Users, ClassRooms, ClassRoomSubscriptions} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors");
const { validateRole } = require('./middleware/auth');

router.get('/topics', validateRole("student"), catchAsyncErrors(async function(req, res, next) {
  const find = await TopicSubscriptions.findAll({
    where: {
      studentId: req.user.id
    },
    include: {
      model: Topics
    }
    
  })
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
  const {id} = req.user
  // Return all students in every classRooms a teacher has created

  const classRooms = await ClassRoomSubscriptions.findAll({
    where: {teacherId: id},
    include: {
      model: Users
    }
  })
  console.log(classRooms)
  // let studentClassRooms = []

  // if (classRooms.length === 0) {
  //   return res.status(200).json({
  //     message: "You have not yet assigned a student to a class room",
  //     students: []
  //   })
  // }
  // console.log(studentClassRooms)

  // return res.status(200).json({
  //   message: "Students retrieved",
  //   students: studentClassRooms
  // })
}))

module.exports = router