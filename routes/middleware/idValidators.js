const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");
const ApiError = require("../../utils/errors");
const {Topics, StudentQuizzes} = require("../../db/models")

module.exports.validateTopicId = async (req, res, next) => {
	 const {id} = req.params
   if (!id) {
    return next(new ApiError("This topic is invalid", 400))
   }
  const find = await Topics.findByPk(id)
  if (!find) {
    return next(new ApiError("This topic is invalid", 400))
  }	
  req.topic = find
}

module.exports.avoidDuplicateQuizEntry = async (req, res, next) => {

}