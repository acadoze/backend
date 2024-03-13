const Sequelize = require("sequelize")
const {database} = require("../config")

const connection = new Sequelize(
  database.database,
  database.username,
  database.password,
  database
);

module.exports = connection