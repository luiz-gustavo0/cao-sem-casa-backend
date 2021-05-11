import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

import routes from './routes'

import './database'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(routes)

export default app
