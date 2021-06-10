const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/database.js')[env]

const Adoption = require('../models/Adoption.js')
const Animal = require('../models/Animal.js')
const User = require('../models/User.js')

const models = [User, Animal, Adoption]

class Database {
  constructor() {
    this.init()
  }

  init() {
    if (config.use_env_variable) {
      this.connection = new Sequelize(
        process.env[config.use_env_variable],
        config
      )
    } else {
      this.connection = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      )
    }
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

module.exports = new Database()
