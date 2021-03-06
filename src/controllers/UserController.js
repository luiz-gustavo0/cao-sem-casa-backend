const yup = require('yup')
const AppError = require('../errors/AppError.js')
const userSchema = require('../helpers/userSchema.js')

const User = require('../models/User.js')

class UserController {
  async index(request, response) {
    const { page = 1 } = request.query

    const users = await User.findAndCountAll({
      attributes: ['id', 'name', 'email'],
      limit: 12,
      offset: (page - 1) * 12
    })

    return response.json(users)
  }

  async show(request, response) {
    const userId = request.params.id

    try {
      const user = await User.findByPk(userId, {
        attributes: [
          'id',
          'name',
          'email',
          'cidade',
          'uf',
          'rua',
          'bairro',
          'numero'
        ]
      })

      if (!user) {
        throw new AppError(400, 'Usuário não cadastrado.')
      }

      return response.json(user)
    } catch (err) {
      throw new AppError(400, err)
    }
  }

  async create(request, response) {
    const userExists = await User.findOne({
      where: { email: request.body.email }
    })

    if (userExists) {
      throw new AppError(400, 'Email já cadastrado.')
    }

    try {
      const validFields = await userSchema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const { id, name, email, rua, bairro, numero, cidade, uf } =
        await User.create(validFields)

      return response
        .status(201)
        .json({ id, name, email, rua, bairro, numero, cidade, uf })
    } catch (err) {
      return response.status(400).json(err)
    }
  }

  async update(request, response) {
    const schema = yup
      .object()
      .shape({
        name: yup.string(),
        rua: yup.string(),
        numero: yup.number(),
        bairro: yup.string(),
        cidade: yup.string(),
        uf: yup.string(2)
      })
      .noUnknown()

    try {
      const { userId } = request.userData

      const user = await User.findByPk(userId)

      if (!user) {
        throw new AppError(400, 'Usuário não encontrado.')
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      await user.update(validFields)

      return response.json({ message: 'Dados atualizados com successo.' })
    } catch (err) {
      return response.status(400).json(err.errors)
    }
  }

  async updatePassword(request, response) {
    const { password, newPassword } = request.body

    const schema = yup
      .object()
      .shape({
        password: yup
          .string()
          .min(8, 'A senha deve conter no mínimo 8 caracteres'),
        newPassword: yup
          .string()
          .min(8, 'A nova senha deve conter no mínimo 8 caracteres')
      })
      .noUnknown()

    try {
      const { userId } = request.userData

      const user = await User.findByPk(userId)

      if (!user) {
        throw new AppError(400, 'Usuário não encontrado.')
      }

      if (!(await user.chekPassword(password))) {
        throw new AppError(
          400,
          'A senha deve ser a mesma utilizada para fazer login'
        )
      }

      const validFields = await schema.validate(
        { password, newPassword },
        {
          abortEarly: false,
          stripUnknown: true
        }
      )

      await user.update({
        password: validFields.newPassword
      })

      return response.json({ message: 'Dados atualizados com successo.' })
    } catch (err) {
      return response.status(400).json(err)
    }
  }

  async delete(request, response) {
    try {
      const { userId } = request.userData

      const user = await User.findByPk(userId)

      if (!user || user.id !== userId) {
        throw new AppError(400, 'Usuário não encontrado.')
      }

      await user.destroy()

      return response.json({ message: 'Deletado com sucesso.' })
    } catch (err) {
      throw new AppError(400, err)
    }
  }
}

module.exports = new UserController()
