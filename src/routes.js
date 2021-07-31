const { Router } = require('express')
const multer = require('multer')

const multerConfig = require('./config/multer.js')

const AdoptionController = require('./controllers/AdoptionController.js')
const AnimalController = require('./controllers/AnimalController.js')
const AuthController = require('./controllers/AuthController.js')
const SendMailController = require('./controllers/SendMailController.js')
const UserController = require('./controllers/UserController.js')

const authMiddleware = require('./middlewares/authMiddleware.js')
const requireAdmin = require('./middlewares/requireAdmin.js')

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
routes.put('/users/change_password/:id', UserController.updatePassword)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

routes.get('/all-pets', requireAdmin, AnimalController.getAll)
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
routes.put('/adoption/:id', requireAdmin, AdoptionController.update)
routes.delete('/adoption/:id', requireAdmin, AdoptionController.delete)

routes.get('/sendmail/:adoption_id', requireAdmin, SendMailController.send)

module.exports = routes
