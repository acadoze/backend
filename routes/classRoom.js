var express = require('express');
var router = express.Router();
const {ClassRooms, Users, ClassRoomSubscriptions} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors")
const { validateRole } = require('./middleware/auth');

router.get('/:id', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const find = await ClassRooms.findByPk(req.params.id)
  if (!find) {
    return next(new ApiError("This class does not exist", 400))
  }
  return res.status(200).json({
    message: "Class room data retrieved",
    classRoom: find
  })
}))
router.get('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const teacherId = req.user.id
  const classRooms = await ClassRooms.findAll({
    where: {
      teacherId
    }
  })
  if (!classRooms || classRooms.length === 0) {
    return res.status(200).json({
      message: "You have not created any class room yet",
      classRooms: []
    })
  }
  return res.status(200).json({
    message: "Class rooms retrieved",
    classRooms
  })
}))

router.put('/:id/subscribe', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const {studentId} = req.body
  const {id} = req.params
  if (!studentId || !await Users.findByPk(studentId)) {
    return next(new ApiError("Student does not exist", 400));
  }
  if (!id || !await ClassRooms.findByPk(id)) {
    return next(new ApiError("Class room room does not exist", 400));
  }
  if (await ClassRoomSubscriptions.findOne({where: {studentId, classRoomId: id}})) {
    return res.status(400).json({
      message: "Student already belongs to the class room"
    })
  }
  await ClassRoomSubscriptions.create({
    studentId,
    teacherId: req.user.id,
    classRoomId: id
  })
  return res.status(200).json({
    message: "Student has been added to the specified class room"
  })
}))

router.post('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const {name} = req.body
  console.log(req.body)
  if (!name) return next(new ApiError("Please provide a Class Name", 400))
  await ClassRooms.create({
    name, teacherId: req.user.id
  })
  return res.status(201).json({
    message: "Class room created"
    
  })
}))

module.exports = router