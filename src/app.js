import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

import routes from './routes'

import './database'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))

app.use(routes)

export default app
