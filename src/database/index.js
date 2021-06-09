import Sequelize from 'sequelize'
import databaseConfig from '../config/database.js'

import Adoption from '../models/Adoption.js'
import Animal from '../models/Animal.js'
import User from '../models/User.js'

const models = [User, Animal, Adoption]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

export default new Database()
