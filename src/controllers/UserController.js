import * as yup from 'yup'
import userSchema from '../helpers/userSchema'

import User from '../models/User'

class UserController {
  async index(request, response) {
    try {
      const { page = 1 } = request.query

      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'foto_url'],
        limit: 20,
        offset: (page - 1) * 20
      })

      return response.json(users)
    } catch (err) {
      return response.status(400).json(err)
    }
  }

  async show(request, response) {
    const userId = request.params.id

    try {
      const user = await User.findByPk(userId, {
        attributes: [
          'id',
          'name',
          'email',
          'foto_url',
          'cidade',
          'uf',
          'rua',
          'bairro',
          'numero'
        ]
      })

      if (!user) {
        return response.status(400).json({ message: 'Usuário não encontrado' })
      }

      return response.json(user)
    } catch (err) {
      return response.status(401).json(err)
    }
  }

  async create(request, response) {
    const userExists = await User.findOne({
      where: { email: request.body.email }
    })

    if (userExists) {
      return response.status(409).json({ error: 'Usuário já cadastrado.' })
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
      console.error('Error', err)
      return response.status(400).json(err)
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
        return response.status(400).json({ error: 'Usuário não encontrado.' })
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      await user.update(validFields)

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
        return response.status(400).json({ error: 'Usuário não encontrado.' })
      }

      await user.destroy()

      return response.json({ message: 'Deletado com sucesso.' })
    } catch (err) {
      return response.status(400).json(err)
    }
  }
}

export default new UserController()
