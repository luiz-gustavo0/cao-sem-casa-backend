const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const authConfig = require('../config/auth.js')

module.exports = async (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
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
    return response.status(401).json({ error: 'Não autorizado' })
  }
}
