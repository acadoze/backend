"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("../../config");
const db = {};

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
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
  TopicSubscriptions: TopicSubscription,
  Users: User,
  ClassRoomSubscriptions: ClassRoomSubscription,
  ClassRooms: ClassRoom,
  Topics: Topic,
} = db

User.hasMany(TopicSubscription, {
  foreignKey: "studentId"
})
TopicSubscription.belongsTo(User, {
  foreignKey: "studentId"
})

Topic.hasMany(TopicSubscription, {
  foreignKey: "topicId"
})
TopicSubscription.belongsTo(Topic, {
  foreignKey: "topicId"
})

User.hasMany(ClassRoom, {
  foreignKey: "teacherId"
})
ClassRoom.belongsTo(User, {
  foreignKey: "teacherId"
})

ClassRoom.hasMany(ClassRoomSubscription, {
  foreignKey: "classRoomId"
})
ClassRoomSubscription.belongsTo(ClassRoom, {
  foreignKey: "classRoomId"
})

User.hasMany(ClassRoomSubscription, {
  foreignKey: "studentId"
})
ClassRoomSubscription.belongsTo(User, {
  foreignKey: "studentId"
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// (async () => {
//   await db.sequelize.sync({ force: true }); // Sync all defined models to the DB
// })();

module.exports = db;
