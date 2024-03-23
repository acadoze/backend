"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../../config");
const db = {};

const sequelize = new Sequelize(
  config.database.database,
  config.database.Usersname,
  config.database.password,
  config.database,
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const {
  TopicSubscriptions,
  Users,
  ClassRoomSubscriptions,
  ClassRooms,
  Topics,
  Quizzes,
  StudentQuizzes
} = db

Users.hasMany(TopicSubscriptions, {
  foreignKey: "studentId"
})
TopicSubscriptions.belongsTo(Users, {
  foreignKey: "studentId"
})

Topics.hasMany(TopicSubscriptions, {
  foreignKey: "topicId"
})
TopicSubscriptions.belongsTo(Topics, {
  foreignKey: "topicId"
})

Users.hasMany(ClassRooms, {
  foreignKey: "teacherId"
})
ClassRooms.belongsTo(Users, {
  foreignKey: "teacherId"
})

ClassRooms.hasMany(ClassRoomSubscriptions, {
  foreignKey: "classRoomId"
})
ClassRoomSubscriptions.belongsTo(ClassRooms, {
  foreignKey: "classRoomId"
})

Users.hasMany(ClassRoomSubscriptions, {
  foreignKey: "studentId"
})
ClassRoomSubscriptions.belongsTo(Users, {
  foreignKey: "studentId"
})

Topics.hasMany(Quizzes, {
  foreignKey: "topicId"
})
Quizzes.belongsTo(Topics, {
  foreignKey: "topicId"
})

Users.hasMany(StudentQuizzes, {
  foreignKey: "studentId"
})
StudentQuizzes.belongsTo(Users, {
  foreignKey: "studentId"
})

Quizzes.hasMany(StudentQuizzes, {
  foreignKey: "quizId"
})
StudentQuizzes.belongsTo(Quizzes, {
  foreignKey: "quizId"
})


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// (async () => {
//   await db.sequelize.sync({ force: true }); // Sync all defined models to the DB
// })();

module.exports = db;
