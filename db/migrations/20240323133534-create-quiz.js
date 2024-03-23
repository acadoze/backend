'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
   
     await queryInterface.createTable('Quizzes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      topicId: {
        type: DataTypes.UUID,
        references: {
          model: "Topics",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: DataTypes.STRING,
      questions: DataTypes.JSON, 
      /** 
       [{
          question: string,
          id: uuid() (string)
          options: [{
            id: uuid (string),
            value: text
          }],
          correctAnswer: uuid (string) - options UUID
        }]
       * **/
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }) 
  },

  async down (queryInterface, DataTypes) {
   
    await queryInterface.dropTable('Quizzes');
  }
};
