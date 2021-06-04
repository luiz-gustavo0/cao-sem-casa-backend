import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'

import AdoptionController from './controllers/AdoptionController'
import AnimalController from './controllers/AnimalController'
import AuthController from './controllers/AuthController'
import SendMailController from './controllers/SendMailController'
import UserController from './controllers/UserController'

import authMiddleware from './middlewares/authMiddleware'
import requireAdmin from './middlewares/requireAdmin'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/auth', AuthController.store)
routes.post('/forgot_password', AuthController.create)
routes.post('/reset_password', AuthController.update)

routes.post('/users', UserController.create)

routes.get('/pets', AnimalController.index)
routes.get('/pets/:id', AnimalController.show)

routes.use(authMiddleware)
routes.get('/users', requireAdmin, UserController.index)
routes.get('/users/:id', UserController.show)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

routes.post(
  '/pets',
  upload.single('file'),
  requireAdmin,
  AnimalController.create
)
routes.put('/pets/:id', requireAdmin, AnimalController.update)
routes.delete('/pets/:id', requireAdmin, AnimalController.delete)

routes.post('/adoption', AdoptionController.create)
routes.get('/adoption', requireAdmin, AdoptionController.index)
routes.get('/adoption/:id', requireAdmin, AdoptionController.show)
routes.delete('/adoption/:id', requireAdmin, AdoptionController.delete)

routes.get('/sendmail/:adoption_id', requireAdmin, SendMailController.send)

export default routes
