require("dotenv").config();

module.exports.database = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "postgres",
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
};

module.exports.JWT_SECRET = process.env.JWT_SECRET
module.exports.SESSION_SECRET = process.env.SESSION_SECRET
module.exports.COOKIE_SECRET = process.env.COOKIE_SECRET
module.exports.CLIENT_ORIGINS = process.env.CLIENT_ORIGINS.split(', ')