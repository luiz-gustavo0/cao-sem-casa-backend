const Sequelize = require('sequelize')
const databaseConfig = require('../config/database.js')

const Adoption = require('../models/Adoption.js')
const Animal = require('../models/Animal.js')
const User = require('../models/User.js')

const models = [User, Animal, Adoption]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection =
      process.env.NODE_ENV === 'production'
        ? new Sequelize(databaseConfig.production)
        : new Sequelize(databaseConfig.development)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

module.exports = new Database()
