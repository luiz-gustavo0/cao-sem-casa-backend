import * as yup from 'yup'

import User from '../models/User'

class UserController {
  async index(request, response) {
    const { page = 1 } = request.query

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'foto_url'],
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

    const schema = yup
      .object()
      .shape({
        name: yup.string().required('Nome é obrgatório'),
        email: yup
          .string()
          .email('Insira um email válido')
          .required('Email é obrigatório'),
        password: yup
          .string()
          .required('Senha é obrgatório')
          .min(8, 'A senha deve conter no mínimo 8 caracteres'),
        rua: yup.string().required(),
        numero: yup.number().required(),
        bairro: yup.string().required(),
        cidade: yup.string().required(),
        uf: yup.string(2).required()
      })
      .noUnknown()

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const user = await User.create(validFields)

      return response.status(201).json(user)
    } catch (err) {
      console.error('Error', err)
      return response.status(400).json(err)
    }
  }

  // async update(request, response) {
  //   const schema = yup
  //     .object()
  //     .shape({
  //       name: yup.string(),
  //       password: yup
  //         .string()
  //         .min(8, 'A senha deve conter no mínimo 8 caracteres'),
  //       rua: yup.string(),
  //       numero: yup.number(),
  //       bairro: yup.string(),
  //       cidade: yup.string(),
  //       uf: yup.string(2)
  //     })
  //     .noUnknown()

  //   try {
  //   } catch (err) {

  //   }
  // }
}

export default new UserController()
