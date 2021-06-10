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
    stringConnection: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    ssl: true,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    }
  }
}
