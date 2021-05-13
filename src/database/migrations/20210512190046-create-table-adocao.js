'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('adoptions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdated: 'CASCADE',
        onDelete: 'CASCADE'
      },
      animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id'
        },
        onUpdated: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('adoptions')
  }
}
