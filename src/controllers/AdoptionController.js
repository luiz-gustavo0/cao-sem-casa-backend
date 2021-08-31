const AppError = require('../errors/AppError.js')

const Adoption = require('../models/Adoption.js')
const Animal = require('../models/Animal.js')
const User = require('../models/User.js')

class AdoptionController {
  async index(request, response) {
    const { page = 1 } = request.query

    const adoptions = await Adoption.findAndCountAll({
      attributes: ['id', 'user_id', 'animal_id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          association: 'user',
          attributes: ['name', 'email']
        },
        {
          association: 'animal',
          attributes: ['name', 'foto_url', 'status', 'tipo']
        }
      ]
    })

    return response.json(adoptions)
  }

  async show(request, response) {
    const adoptionId = request.params.id

    try {
      const adoption = await Adoption.findByPk(adoptionId, {
        attributes: ['id'],
        include: [
          {
            association: 'user',
            attributes: ['name', 'email', 'cidade', 'uf']
          },
          {
            association: 'animal',
            attributes: ['name', 'foto_url', 'status', 'tipo']
          }
        ]
      })

      if (!adoption) {
        throw new AppError(400, 'Item não encontrado.')
      }

      return response.json(adoption)
    } catch (error) {
      throw new AppError(403, 'Recurso não permitido.')
    }
  }

  async create(request, response) {
    try {
      const { userId } = request.userData

      const user = await User.findOne({
        where: {
          email: request.body.email
        }
      })

      if (!user) {
        throw new AppError(
          400,
          'O email deve ser o mesmo cadastrado no sistema.'
        )
      }

      const animal = await Animal.findByPk(request.body.animalId)
      if (!animal) {
        throw new AppError(400, 'Animal não encontrado')
      }

      const adoption = await Adoption.create({
        user_id: userId,
        animal_id: animal.id
      })

      await animal.update({
        status: 'em analise'
      })

      return response.status(201).json(adoption)
    } catch (err) {
      console.log('ERROR:', err)
      throw new AppError(400, err.message)
    }
  }

  async update(request, response) {
    const adoptionId = request.params.id

    try {
      const adoption = await Adoption.findByPk(adoptionId)

      if (!adoption) {
        throw new AppError(400, 'Item não encontrado')
      }

      const { animal_id } = adoption

      const animal = await Animal.findByPk(animal_id)

      if (!animal) {
        throw new AppError(400, 'Animal não encontrado')
      }

      await animal.update({ status: 'adotado' })

      return response.json({ message: 'Adoção confirmada.' })
    } catch (err) {
      throw new AppError(403, 'Recurso não permitido.')
    }
  }

  async delete(request, response) {
    const adoptionId = request.params.id

    try {
      const adoption = await Adoption.findByPk(adoptionId)

      if (!adoption) {
        throw new AppError(400, 'Item não encontrado')
      }

      const { animal_id } = adoption

      const animal = await Animal.findByPk(animal_id)

      if (!animal) {
        throw new AppError(400, 'Animal não encontrado')
      }

      const animalUpdate = await animal.update({ status: 'nao adotado' })

      console.log(animalUpdate)

      await adoption.destroy()

      return response.json({ message: 'Excluído com sucesso' })
    } catch (err) {
      throw new AppError(403, 'Recurso não permitido.')
    }
  }
}

module.exports = new AdoptionController()
