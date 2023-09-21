'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull : false,
        type: Sequelize.STRING
      },
      year: {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      genre: {
        allowNull : false,
        type: Sequelize.ENUM('klasik','tradisional','blues','pop','country','reggae'),
      },
      performer: {
        allowNull : false,
        type: Sequelize.STRING,
      },
      duration: {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      albumId : {
        allowNull : false,
        type : Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  }
};