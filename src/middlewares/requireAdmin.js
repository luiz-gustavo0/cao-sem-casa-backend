module.exports = function (request, response, next) {
  const { role } = request.userData

  if (typeof role !== 'string' || role !== 'admin') {
    return response.status(403).json({ message: 'Recurso não permitido.' })
  }

  return next()
}
