import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

export default app
