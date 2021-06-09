import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import authConfig from '../config/auth.js'

export default async (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    console.log('Auth middleware')
    return response.status(401).json({ error: 'Não autorizado' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const tokenDecoded = await promisify(jwt.verify)(token, authConfig.secret)

    request.userData = {
      email: tokenDecoded.email,
      userId: tokenDecoded.id,
      role: tokenDecoded.role
    }

    return next()
  } catch (err) {
    console.log('Error', err)
    return response.status(401).json({ error: 'Não autorizado' })
  }
}
