'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('animals', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('animals')
  }
}
