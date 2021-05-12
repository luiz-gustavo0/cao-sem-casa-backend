'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('animals', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      peso: {
        allowNull: false,
        type: Sequelize.DECIMAL(5, 2)
      },
      idade: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      raca: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tipo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      vacinado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      vermifugado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      castrado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      foto_url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['adotado', 'nao adotado'],
        defaultValue: 'nao adotado'
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
    await queryInterface.dropTable('animals')
  }
}
