var express = require('express');
var router = express.Router();
const {Topics: Topic, Users: User, TopicSubscriptions: TopicSubscription} = require("../db/models")
const bcrypt = require("bcrypt")
const {JWT_SECRET} = require("../config");
const { catchAsyncErrors } = require('./middleware/errors');
const { validateTopicId } = require('./middleware/idValidators');
const ApiError = require("../utils/errors")
const path = require("path")

const OpenAI = require("openai")
const speechSDK = require("microsoft-cognitiveservices-speech-sdk")
const { PassThrough } = require('stream')
const fs = require("fs");
const { validateRole } = require('./middleware/auth');

const speechconfig = speechSDK.SpeechConfig.fromSubscription(
  process.env["AZURE_SPEECH_KEY"],
  process.env["AZURE_SPEECH_REGION"]
)
const config = {
  apiKey: process.env["OPENAI_KEY"]
}
const openai = new OpenAI(config)

router.get('/:id/chat', validateRole("student"), validateTopicId, catchAsyncErrors(async function(req, res, next) {
  const {id} = req.params
  const topic = req.topic
  const knowledgeContent = fs.readFileSync(path.join(__dirname, `../knowledge/${(topic.title).toLowerCase()}.txt`) , 'utf8');

  const {question} = req.query
  const teacher = "Ava" // or Andrew
  speechconfig.speechSynthesisVoiceName = `en-US-${teacher}Neural` // UK

  const speechSynthesizer = new speechSDK.SpeechSynthesizer(speechconfig)
  const visemes = []
  speechSynthesizer.visemeReceived = function (s, e) {
    visemes.push([e.audioOffset / 10000 , e.visemeId])
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        "role": "system",
        content: "Your Name is Acadoze and you are an experienced elementary teacher and also an expert in History. With a passion for History, you guide students towards a love for learning and exploration. Your response should have a full stop at the end of every sentence. Use simpler terminology and vocabulary. Aim at 8 year old student. When in the middle of the conversation, use filers like uhms to continues the next statement"
      },
      {
        "role": "system", 
        "content": knowledgeContent
      },
      {
        role: "user",
        content: question || ""
      }
    ],
    temperature: 0.5
  });
  console.log("--- CHAT COMPLETE ---")

  const chatAnswer = completion.choices[0].message.content
 
  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      chatAnswer,
      result => {
        const {audioData} = result
        speechSynthesizer.close()
        const bufferStream = new PassThrough()
        bufferStream.end(Buffer.from(audioData))
        resolve(bufferStream)
      },
      error => {
        console.error(error)
        speechSynthesizer.close()
        reject(error)
      }
    )
  })
  console.log("--- AUDIO COMPLETE ---");
  res.setHeader("Content-Type", "audio/mpeg")
  res.setHeader("Content-Disposition", `inline; filename=tts.mp3`)
  res.setHeader("visemes", JSON.stringify(visemes))
  res.set("Access-Control-Expose-Headers","visemes")

  audioStream.pipe(res);

}))

router.put('/:id/subscribe', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const {studentId} = req.body
  const {id} = req.params
  const topic  = await Topic.findByPk(id)
  if (!studentId || !await User.findByPk(studentId)) {
    return next(new ApiError("Student does not exist", 400));
  }
  if (!id || !await Topic.findByPk(id)) {
    return next(new ApiError("Topic does not exist", 400));
  }
  await TopicSubscription.create({
    studentId,
    topicId: id
  })
  return res.status(200).json({
    message: "Topic assigned"
  })
}))

router.get('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const find = await Topic.findAll()
  return res.status(200).json({
    topics: find
  })
}))

router.post('/', validateRole("teacher"), catchAsyncErrors(async function(req, res, next) {
  const {title} = req.body
  if (!title) {
    return next(new ApiError("Please provide a title", 400));
  }
  await Topic.create({
    title
  })
  return res.status(201).json({
    message: "Topic created"
  })

}))


module.exports = router;
