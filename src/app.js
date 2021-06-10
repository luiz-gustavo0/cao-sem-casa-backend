const dotenv = require('dotenv')
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

dotenv.config()

require('./database/index.js')

const routes = require('./routes.js')
const errorHandler = require('./errors/handler.js')
const AppError = require('./errors/AppError.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))

app.use(routes)

app.use(errorHandler)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    status: 'Error',
    message: `Internal server error ${error.message}`
  })
})

module.exports = app
