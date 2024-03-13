const router = require("express").Router();
const authRoute = require("./auth");

router.post("/auth", authRoute);

module.exports = router;
