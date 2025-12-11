const Pet = require('../models/Pet')
const User = require('../models/User')   // <<-- NECESSÁRIO PARA INCLUDE
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

module.exports = class PetController {

  static async create(req, res) {
    const { name, age, weight, color } = req.body

    // validações
    if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' })
    if (!age) return res.status(422).json({ message: 'A idade é obrigatória!' })
    if (!weight) return res.status(422).json({ message: 'O peso é obrigatório!' })
    if (!color) return res.status(422).json({ message: 'A cor é obrigatória!' })

    // pega o usuário logado via token
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (!user) {
      return res.status(401).json({ message: "Usuário não autenticado!" })
    }

    try {
      // cria o pet
      const pet = await Pet.create({
        name,
        age,
        weight,
        color,
        images: [],      
        available: true,
        userId: user.id  // dono do pet
      })

      // busca novamente com o relacionamento "owner"
      const newPet = await Pet.findByPk(pet.id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'image', 'phone']
          }
        ]
      })

      return res.status(201).json({
        message: "Pet cadastrado com sucesso!",
        pet: newPet
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Erro ao cadastrar pet" })
    }
  }

}
