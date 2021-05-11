'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rua: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numero: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      cidade: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bairro: {
        allowNull: false,
        type: Sequelize.STRING
      },
      uf: {
        allowNull: false,
        type: Sequelize.STRING
      },
      foto_url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('users')
  }
}
