import { AppError } from '../errors/AppError'

import Adoption from '../models/Adoption'
import Animal from '../models/Animal'

class AdoptionController {
  async index(request, response) {
    const { page = 1 } = request.query

    const adoptions = await Adoption.findAll({
      attributes: ['id', 'user_id', 'animal_id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          association: 'user',
          attributes: ['name', 'email', 'foto_url']
        },
        {
          association: 'animal',
          attributes: ['name', 'foto_url']
        }
      ]
    })

    return response.json(adoptions)
  }

  async show(request, response) {
    const adoptionId = request.params.id

    try {
      const { role } = request.userData

      if (typeof role !== 'string' || role === 'user') {
        throw new AppError(403, 'Recurso não permitido.')
      }

      const adoption = await Adoption.findByPk(adoptionId, {
        attributes: ['id'],
        include: [
          {
            association: 'user',
            attributes: [
              'name',
              'email',
              'foto_url',
              'rua',
              'bairro',
              'numero',
              'cidade',
              'uf'
            ]
          },
          {
            association: 'animal',
            attributes: ['name', 'foto_url']
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

      const { animalId } = request.body

      const animal = await Animal.findByPk(animalId)
      if (!animal) {
        throw new AppError(400, 'Animal não encontrado')
      }

      const adoption = await Adoption.create({
        user_id: userId,
        animal_id: animal.id
      })

      await animal.update({ status: 'adotado' })

      return response.status(201).json(adoption)
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

      await adoption.destroy()

      return response.json({ message: 'Excluído com sucesso' })
    } catch (err) {
      throw new AppError(403, 'Recurso não permitido.')
    }
  }
}

export default new AdoptionController()
