const { resolve } = require('path')

const SendMailService = require('../services/SendMailService.js')

const Adoption = require('../models/Adoption.js')
const Animal = require('../models/Animal.js')
const User = require('../models/User.js')

class SendMailController {
  async send(request, response) {
    const adoptionId = request.params.adoption_id

    const adoption = await Adoption.findByPk(adoptionId)

    if (!adoption) {
      console.log('Error Adoption', adoption)
      return response
        .status(400)
        .json({ message: 'Registro de adoção não encontrado.' })
    }

    const { user_id, animal_id } = adoption

    const user = await User.findByPk(user_id)

    if (!user) {
      console.log('Error User', user)

      return response.status(400).json({ message: 'Usuário não encontrado.' })
    }

    const animal = await Animal.findByPk(animal_id)

    if (!animal) {
      console.log('Error Animal', animal)

      return response.status(400).json({ message: 'Animal não encontrado.' })
    }

    const path = resolve(__dirname, '..', 'views', 'emails', 'adoptionMail.hbs')

    const variables = {
      name: user.name,
      title: 'Confirmação de Adoção',
      animalName: animal.name,
      animalFoto: animal.foto_url,
      id: adoption.id
    }

    await SendMailService.execute(user.email, variables.title, variables, path)

    return response.json({ message: 'Email enviado com sucesso.' })
  }
}

module.exports = new SendMailController()
