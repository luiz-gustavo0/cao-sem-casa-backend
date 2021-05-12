import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'

import AnimalController from './controllers/AnimalController'
import UserController from './controllers/UserController'

const routes = Router()
const upload = multer(multerConfig)

routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.post('/users', UserController.create)

routes.get('/pets', AnimalController.index)
routes.post('/pets', upload.single('file'), AnimalController.create)

export default routes
