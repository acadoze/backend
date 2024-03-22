var express = require('express');
var router = express.Router();
const {User} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors")

router.post('/', catchAsyncErrors(async function(req, res, next) {
  
}))

router.get('/', catchAsyncErrors(async function(req, res, next) {
  
}))

router.get('/:id', catchAsyncErrors(async function(req, res, next) {
  
}))




module.exports = router;
