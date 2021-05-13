import * as yup from 'yup'
import animalSchema from '../helpers/animalSchema'

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

    try {
      if (!file) {
        return response
          .status(400)
          .json({ error: 'O campo de imagem é obrigatório' })
      }

      const validFields = await animalSchema.validate(request.body, {
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

    const schema = yup
      .object()
      .shape({
        peso: yup.number().positive(),
        idade: yup.number().positive(),
        vacinado: yup.string(),
        vermifugado: yup.string(),
        castrado: yup.string()
      })
      .noUnknown()
    try {
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

    try {
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
