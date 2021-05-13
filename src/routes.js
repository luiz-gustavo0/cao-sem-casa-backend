import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'

import AdoptionController from './controllers/AdoptionController'
import AnimalController from './controllers/AnimalController'
import AuthController from './controllers/AuthController'
import UserController from './controllers/UserController'

import authMiddleware from './middlewares/authMiddleware'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/auth', AuthController.create)

routes.post('/users', UserController.create)

routes.get('/pets', AnimalController.index)
routes.get('/pets/:id', AnimalController.show)

routes.use(authMiddleware)
routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

routes.post('/pets', upload.single('file'), AnimalController.create)
routes.put('/pets/:id', AnimalController.update)
routes.delete('/pets/:id', AnimalController.delete)

routes.get('/adoption', AdoptionController.index)
routes.get('/adoption/:id', AdoptionController.show)
routes.post('/adoption', AdoptionController.create)
routes.delete('/adoption/:id', AdoptionController.delete)

export default routes
