import Sequelize, { Model } from 'sequelize'

class Animal extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        name: Sequelize.STRING,
        peso: Sequelize.DECIMAL(5, 2),
        idade: Sequelize.INTEGER,
        raca: Sequelize.STRING,
        tipo: Sequelize.STRING,
        vacinado: Sequelize.STRING,
        vermifugado: Sequelize.STRING,
        castrado: Sequelize.STRING,
        foto_url: Sequelize.STRING,
        status: Sequelize.STRING,
        sexo: {
          type: Sequelize.ENUM,
          values: ['F', 'M']
        }
      },
      {
        sequelize
      }
    )

    return this
  }
}

export default Animal
