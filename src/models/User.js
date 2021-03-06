const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const { Model } = Sequelize
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        rua: Sequelize.STRING,
        numero: Sequelize.STRING,
        bairro: Sequelize.STRING,
        cidade: Sequelize.STRING,
        uf: Sequelize.STRING,
        password_reset_token: Sequelize.STRING,
        password_expires_token: Sequelize.STRING,
        role: Sequelize.STRING
      },
      {
        sequelize
      }
    )

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })

    return this
  }

  async chekPassword(password) {
    return await bcrypt.compare(password, this.password_hash)
  }

  static associate(models) {
    this.hasMany(models.Adoption, {
      foreignKey: 'user_id',
      as: 'adoptions'
    })
  }
}

module.exports = User
