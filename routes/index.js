const router = require("express").Router();
const authRoute = require("./auth");
const topicRoute = require("./topic");
const ttsRoute = require("./tts");
const classRoomRoute = require("./classRoom");
const studentRoute = require("./student");
const assessmentRoute = require("./assessment");
const {authenticateUser} = require("./middleware/auth")

router.use("/auth", authRoute);
router.use("/topic", authenticateUser, topicRoute);
router.use("/tts", authenticateUser, ttsRoute);
router.use("/assessment", authenticateUser, assessmentRoute);
router.use("/student", authenticateUser, studentRoute);
router.use("/classRoom", authenticateUser, classRoomRoute);

// router.use("/me", authenticateUser, getUser)

module.exports = router;