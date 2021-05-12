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

  async create(request, response) {
    try {
      const { userId } = request.userData

      const { animalId } = request.body

      const animal = await Animal.findByPk(animalId)
      if (!animal) {
        return response.status(400).json({ error: 'Animal não encontrado' })
      }

      const adoption = await Adoption.create({
        user_id: userId,
        animal_id: animal.id
      })

      await animal.update({ status: 'adotado' })

      return response.status(201).json(adoption)
    } catch (err) {
      console.log('ERROR', err)

      return response.status(403).json({ error: 'Recurso não permitido.' })
    }
  }
}

export default new AdoptionController()
