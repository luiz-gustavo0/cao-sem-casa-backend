const yup = require('yup')
const animalSchema = require('../helpers/animalSchema.js')
const AppError = require('../errors/AppError.js')

const Animal = require('../models/Animal.js')

class AnimalController {
  async index(request, response) {
    const { page = 1 } = request.query

    const animals = await Animal.findAll({
      where: {
        status: 'nao adotado' || 'não adotado'
      },
      limit: 12,
      offset: (page - 1) * 12
    })

    return response.json(animals)
  }

  async getAll(request, response) {
    const { page = 1 } = request.query
    const animals = await Animal.findAndCountAll({
      limit: 12,
      offset: (page - 1) * 12
    })

    return response.json(animals)
  }

  async show(request, response) {
    const userId = request.params.id
    try {
      const animal = await Animal.findByPk(userId)
      if (!animal) {
        throw new AppError(400, 'Animal não encontrado.')
      }
      return response.json(animal)
    } catch (err) {
      throw new AppError(400, err)
    }
  }

  async create(request, response) {
    const file = request.file

    try {
      if (!file) {
        throw new AppError(400, 'O campo de imagem é obrigatório')
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
    const animalId = request.params.id

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
        castrado: yup.string(),
        description: yup.string(),
        sexo: yup.string()
      })
      .noUnknown()

    try {
      const animal = await Animal.findByPk(animalId)

      if (!animal) {
        throw new AppError(400, 'Animal não encontrado.')
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })

      const newDataAnimal = await animal.update({
        ...validFields
      })

      return response.status(200).json(newDataAnimal)
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
        throw new AppError(400, 'Animal não encontrado.')
      }

      await animal.destroy()

      return response.json({ message: 'Deletado com sucesso' })
    } catch (err) {
      throw new AppError(400, err)
    }
  }
}

module.exports = new AnimalController()
