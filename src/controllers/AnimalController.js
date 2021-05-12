import * as yup from 'yup'

import Animal from '../models/Animal'

class AnimalController {
  async index(request, response) {
    const { page = 1 } = request.query

    const animals = await Animal.findAll({
      limit: 20,
      offset: (page - 1) * 20
    })

    return response.json(animals)
  }

  async create(request, response) {
    const file = request.file

    console.log(file)
    try {
      if (!file) {
        return response
          .status(400)
          .json({ error: 'O campo de imagem é obrigatório' })
      }

      const schema = yup
        .object()
        .shape({
          name: yup.string().required('Este campo é obrigatório'),
          peso: yup.number().positive().required('Este campo é obrigatório'),
          idade: yup.number().positive().required('Este campo é obrigatório'),
          raca: yup.string().required('Este campo é obrigatório'),
          tipo: yup.string().required('Este campo é obrigatório'),
          vacinado: yup.string().required('Este campo é obrigatório'),
          vermifugado: yup.string().required('Este campo é obrigatório'),
          castrado: yup.string().required('Este campo é obrigatório')
        })
        .noUnknown()

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const animal = await Animal.create({
        ...validFields,
        foto_url: file.location
      })

      return response.status(201).json(animal)
    } catch (err) {
      return response.status(400).json(err)
    }
  }
}

export default new AnimalController()
