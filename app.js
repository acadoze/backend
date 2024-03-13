const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const routes = require("./routes");
const session = require("express-session");
const { SESSION_SECRET, COOKIE_SECRET } = require("./config");
const helmet = require("helmet");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));


app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  }),
);

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (req.app.get("env") === "development") {
    res.locals.error = err;
    console.error(err, err.stack);
  } else {
    res.locals.error = {};
  }

  // render the error page
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
