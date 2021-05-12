import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

import User from '../models/User'

class AuthController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      console.log('sem usuario', user)
      return response.status(401).json({ error: 'Não autorizado' })
    }

    if (!(await user.chekPassword(password))) {
      return response.status(401).json({ error: 'Email ou senha inválidos' })
    }

    const { id, name, role } = user

    return response.json({
      user: { id, name, email },
      token: jwt.sign({ id, email, role }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new AuthController()
