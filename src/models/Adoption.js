import Sequelize from 'sequelize'

const { Model } = Sequelize

class Adoption extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        }
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' })
  }
}

export default Adoption
