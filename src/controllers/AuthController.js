const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { resolve } = require('path')

const authConfig = require('../config/auth.js')
const SendMailService = require('../services/SendMailService.js')
const AppError = require('../errors/AppError.js')

const User = require('../models/User.js')

class AuthController {
  async store(request, response) {
    const { email, password } = request.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw new AppError(400, 'Email ou senha inválidos.')
      }

      if (!(await user.chekPassword(password))) {
        throw new AppError(400, 'Email ou senha inválidos')
      }

      const { id, name, role } = user

      return response.json({
        user: { id, name, email, role },
        token: jwt.sign({ id, role }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    } catch (err) {
      throw new AppError(400, err.message)
    }
  }

  async create(request, response) {
    const { email } = request.body

    try {
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        throw new AppError(400, 'Usuário não encontrado.')
      }

      const token = crypto.randomBytes(32).toString('hex')

      const tokenExpirationTime = new Date()

      tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 1)

      await user.update({
        password_reset_token: token,
        password_expires_token: JSON.stringify(tokenExpirationTime)
      })

      const path = resolve(
        __dirname,
        '..',
        'views',
        'emails',
        'forgotPasswordMail.hbs'
      )

      const variables = {
        name: user.name,
        email: user.email,
        title: 'Recuperção de senha',
        token
      }

      await SendMailService.execute(
        user.email,
        variables.title,
        variables,
        path
      )

      return response.json({ message: 'Email enviado.' })
    } catch (err) {
      throw new AppError(400, err)
    }
  }

  async update(request, response) {
    const { email, token, password } = request.body

    try {
      const user = await User.findOne({
        where: {
          email
        },
        attributes: [
          'id',
          'password_reset_token',
          'password_expires_token',
          'password'
        ]
      })

      console.log(user)

      if (!user) {
        throw new AppError(400, 'Usuário não encontrado')
      }

      if (token !== user.password_reset_token) {
        throw new AppError(400, 'Token inválido')
      }

      const dateNow = new Date()

      if (dateNow > user.password_expires_token) {
        throw new AppError(400, 'Token expirado, gere um novo.')
      }

      user.password = password

      await user.save(user.id)

      return response.json({ message: 'Senha alterada com sucesso' })
    } catch (err) {
      throw new AppError(400, err)
    }
  }
}

module.exports = new AuthController()
