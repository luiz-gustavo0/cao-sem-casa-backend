import * as yup from 'yup'
import { AppError } from '../errors/AppError'
import userSchema from '../helpers/userSchema'

import User from '../models/User'

class UserController {
  async index(request, response) {
    const { page = 1 } = request.query

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20
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
      throw new AppError(409, 'Usuário já cadastrado.')
    }

    try {
      const validFields = await userSchema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const { id, name, email, foto_url, rua, bairro, numero, cidade, uf } =
        await User.create(validFields)

      return response
        .status(201)
        .json({ id, name, email, foto_url, rua, bairro, numero, cidade, uf })
    } catch (err) {
      return response.status(400).json({ errors: err.errors })
    }
  }

  async update(request, response) {
    const schema = yup
      .object()
      .shape({
        name: yup.string(),
        password: yup
          .string()
          .min(8, 'A senha deve conter no mínimo 8 caracteres'),
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

export default new UserController()
