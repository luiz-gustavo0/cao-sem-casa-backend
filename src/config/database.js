require('dotenv').config()

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    seederStorage: 'sequelize',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    }
  },

  production: {
    host: process.env.DB_PROD_HOST,
    port: process.env.DB_PROD_PORT,
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_DATABASE,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    }
  }
}
