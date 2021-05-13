import * as yup from 'yup'

import Animal from '../models/Animal'

class AnimalController {
  async index(request, response) {
    const { page = 1 } = request.query

    const animals = await Animal.findAll({
      where: {
        status: 'nao adotado'
      },
      limit: 20,
      offset: (page - 1) * 20
    })

    return response.json(animals)
  }

  async show(request, response) {
    const userId = request.params.id
    try {
      const animal = await Animal.findByPk(userId)
      if (!animal) {
        return response.status(400).json({ error: 'Animal não encontrado.' })
      }
      return response.json(animal)
    } catch (err) {
      return response.status(400).json(err)
    }
  }

  async create(request, response) {
    const file = request.file
    const { role } = request.userData

    try {
      if (typeof role !== 'string' || role === 'user') {
        return response.status(403).json({ message: 'Recurso não permitido.' })
      }

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
          castrado: yup.string().required('Este campo é obrigatório'),
          sexo: yup.string(1).required('Este campo é obrigatório')
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

  async update(request, response) {
    // const file = request.file
    const animalId = request.params.id

    const { role } = request.userData

    const schema = yup
      .object()
      .shape({
        name: yup.string(),
        peso: yup.number().positive(),
        idade: yup.number().positive(),
        raca: yup.string(),
        tipo: yup.string(),
        vacinado: yup.string(),
        vermifugado: yup.string(),
        castrado: yup.string()
      })
      .noUnknown()
    try {
      if (typeof role !== 'string' || role === 'user') {
        return response.status(403).json({ message: 'Recurso não permitido.' })
      }

      const animal = await Animal.findByPk(animalId)

      if (!animal) {
        return response.status(400).json({ error: 'Animal não encontrado.' })
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const newData = await animal.update({ ...validFields })

      return response.status(200).json(newData)
    } catch (err) {
      console.log('ERROR', err)
      return response.status(400).json(err)
    }
  }

  async delete(request, response) {
    const animalId = request.params.id
    const { role } = request.userData

    try {
      if (typeof role !== 'string' || role === 'user') {
        return response.status(403).json({ message: 'Recurso não permitido.' })
      }

      const animal = await Animal.findByPk(animalId)

      if (!animal) {
        return response.status(400).json({ error: 'Animal não encontrado.' })
      }

      await animal.destroy()

      return response.json({ message: 'Deletado com sucesso' })
    } catch (err) {
      return response.status(400).json(err)
    }
  }
}

export default new AnimalController()
