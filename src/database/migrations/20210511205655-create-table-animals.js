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
        type: Sequelize.STRING,
        allowNull: false
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
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'nao adotado'
      },
      sexo: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['F', 'M']
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
