module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "StudentQuizzes",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quizId: {
        type: DataTypes.UUID,
        references: {
          model: "Quizzes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      submitted: DataTypes.BOOLEAN,
      responses: DataTypes.JSON,
      /*
        [{
          questionId: uuid - UUID for the Question
          optionId: uuid - UUID for the option selected
          attempts: [uuid - UUIDs for the options selected]
        }]
      */
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }
  );

};
