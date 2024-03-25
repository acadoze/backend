var express = require('express');
var router = express.Router();
const {Topics, StudentQuizzes, Quizzes} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors")
const path = require("path")
const {v4: uuid} = require("uuid")

const OpenAI = require("openai")
const fs = require("fs");
const { validateRole } = require('./middleware/auth');


const config = {
  apiKey: process.env["OPENAI_KEY"]
}
const openai = new OpenAI(config);

router.get('/', validateRole("student"), catchAsyncErrors(async function(req, res, next) {
  const {topicId} = req.query
  if (!topicId || await Topics.findByPk(topicId) === null) {
    return next(new ApiError("This topic is invalid", 400))
  }

  // Multiple quizzes will be created for topics
  let find = await Quizzes.findOne({
    where: {
      topicId
    }
  })
  if (!find) {
    return res.status(200).json({
      message: "No quiz has been created for this topic yet."
    })
  }
  find.questions = JSON.parse(find.questions)

  find.questions = find.questions.map((i, idx) => ({
    ...i,
    correctAnswer: ""
  }))
console.log(find)
  return res.status(200).json({
    message: "Quiz retrived",
    quiz: find
  })
}))

router.put('/:id/submit', validateRole("student"), catchAsyncErrors(async function(req, res, next) {
  const {responses} = req.body
  const find = await StudentQuizzes.findOne({where:{quizId: req.params.id, studentId: req.user.id}})
  if (find) {
    return res.status(400).json({
      message: "This quiz has already been submitted"
    })
  } else {
    await StudentQuizzes.create({
      submitted: true, 
      responses: JSON.stringify(responses), 
      quizId: req.params.id, 
      studentId: req.user.id
    })
  }
  
  res.status(200).json({
    message: "Quiz has been submitted."
  })
}))


router.post('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const {topicId} = req.query
  const topic = await Topics.findByPk(topicId)
  if (!topic) {
    return next(new ApiError("This topic is invalid", 400))
  } 
  if (await Quizzes.findOne({where: {topicId}})) {
    return next(new ApiError("A quiz already exist for this topic ID", 400))
  }
  const knowledgeContent = fs.readFileSync(path.join(__dirname, `../knowledge/${(topic.title).toLowerCase()}.txt`) , 'utf8');

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        "role": "system",
        content: "Your Name is Acadoze and you are an experienced elementary teacher and also an expert in History. Generate some questions that should be served as quiz for the students. Use simpler terminology and vocabulary. Aim at 8 year old student."
      },
      {
        "role": "system", 
        "content": knowledgeContent
      },
      {
        role: "user",
        content: `Generate a quiz of ten questions in this json format 
          {
            quizTitle: string,
            questions: [{
              question: string,
              options: [],
              correctAnswer: index - NOTE: index should start from 0
              ALSO NOTE: Limit the options to three
            }]
           }
        `
      }
    ],
    temperature: 0.5
  });
  let quiz = JSON.parse(completion.choices[0].message.content)

  quiz.questions.forEach((i, qIdx) => {
    quiz.questions[qIdx].id = uuid() 
    i.options.forEach((option, oIndx) => {
     let nOption = {
        id: uuid(),
        value: option
      }
      quiz.questions[qIdx].options[oIndx] = nOption
    })
    quiz.questions[qIdx].correctAnswer = quiz.questions[qIdx].options[quiz.questions[qIdx].correctAnswer].id
  })
  await Quizzes.create({
    title: quiz.quizTitle,
    topicId,
    questions: JSON.stringify(quiz.questions)
  })
  return res.status(201).json({
    message: "Quiz created",
    quiz
  })

}))

module.exports = router;
