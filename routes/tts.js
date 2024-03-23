var express = require('express');
var router = express.Router();
const axios = require("axios")

const { catchAsyncErrors } = require('./middleware/errors');
const ApiError = require("../utils/errors");
const { validateRole } = require('./middleware/auth');

router.get('/speech_token', validateRole("student"), catchAsyncErrors(async function(req, res, next) {
  const speechKey = process.env["AZURE_SPEECH_KEY"];
  const speechRegion = process.env["AZURE_SPEECH_REGION"];

  if (!speechKey || !speechRegion) {
    return next(new ApiError('You forgot to add your speech key or region to the .env file.', 401))
  } else {
    const headers = { 
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
    return res.status(200).json({
      token: tokenResponse.data, region: speechRegion
    })
  }
}))

module.exports = router