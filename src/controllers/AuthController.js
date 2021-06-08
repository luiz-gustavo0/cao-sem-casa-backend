import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { resolve } from 'path'

import authConfig from '../config/auth'
import SendMailService from '../services/SendMailService'
import { AppError } from '../errors/AppError'

import User from '../models/User'

class AuthController {
  async store(request, response) {
    const { email, password } = request.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new AppError(400, 'Email ou senha inválidos.')
    }

    if (!(await user.chekPassword(password))) {
      throw new AppError(401, 'Email ou senha inválidos')
    }

    const { id, name, role } = user

    return response.json({
      user: { id, name, email },
      token: jwt.sign({ id, role }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }

  async create(request, response) {
    const { email } = request.body

    try {
      const user = await User.findOne({
        where: {
          email
        }
      })

      console.log(user)

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

export default new AuthController()
