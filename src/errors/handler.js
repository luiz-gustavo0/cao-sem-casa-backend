const yup = require('yup')

const { ValidationError } = yup

const errorHandler = (error, request, response, next) => {
  if (error instanceof ValidationError) {
    let errors = {}

    error.inner.forEach((err) => {
      errors[err.path] = err.errors
    })

    return response.status(400).json({ message: 'Validation fail', errors })
  }
  console.log(error)

  next(error)
}

module.exports = errorHandler
