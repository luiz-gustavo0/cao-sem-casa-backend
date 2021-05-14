import jwt from 'jsonwebtoken'

import authConfig from '../config/auth'
import { AppError } from '../errors/AppError'

import User from '../models/User'

class AuthController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new AppError(401, 'Não autorizado')
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
}

export default new AuthController()
