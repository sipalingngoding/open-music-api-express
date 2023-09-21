'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Songs',{
      fields : ['albumId'],
      type : 'foreign key',
      name : 'fk-albumId',
      references : {
        table : 'Albums',
        field : 'id'
      },
      onDelete :'CASCADE',
      onUpdate :'CASCADE',
    })
  },

  async down (queryInterface, Sequelize) {
    await  queryInterface.removeConstraint('Songs','fk-albumId');
  }
};
