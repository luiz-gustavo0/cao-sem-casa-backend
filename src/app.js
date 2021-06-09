import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

// import { AppError } from './errors/AppError'
import './database/index.js'

import routes from './routes.js'
import errorHandler from './errors/handler.js'
import { AppError } from './errors/AppError.js'

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

export default app
