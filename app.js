const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const routes = require("./routes");
const {COOKIE_SECRET, CLIENT_ORIGINS } = require("./config");
const helmet = require("helmet");
const cors = require('cors')

app.use(helmet({ contentSecurityPolicy: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));

app.use(cors({
  methods: 'GET, POST, DELETE, PUT',
  origin: CLIENT_ORIGINS,
  credentials: true
}));
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  process.env["NODE_ENV"] === "development" && console.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
