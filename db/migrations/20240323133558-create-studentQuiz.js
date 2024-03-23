'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    
    await queryInterface.createTable('StudentQuizzes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quizId: {
        type: DataTypes.UUID,
        unique: true,
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
    })
  },

  async down (queryInterface, DataTypes) {
    
     await queryInterface.dropTable('StudentQuizzes');
  }
};
