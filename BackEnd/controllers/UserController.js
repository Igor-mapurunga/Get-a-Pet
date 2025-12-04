const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class UserController {

  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body

   
    if (!name) return res.status(422).json({ message: 'O nome é obrigatório' })
    if (!email) return res.status(422).json({ message: 'O email é obrigatório' })
    if (!phone) return res.status(422).json({ message: 'O telefone é obrigatório' })
    if (!password) return res.status(422).json({ message: 'A senha é obrigatória' })
    if (!confirmpassword) return res.status(422).json({ message: 'A confirmação da senha é obrigatória' })

    if (password !== confirmpassword) {
      return res.status(422).json({ message: 'A senha e sua confirmação devem ser iguais' })
    }

    
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
      return res.status(422).json({ message: 'Por favor utilize outro e-mail' })
    }

    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    try {
      
      const newUser = await User.create({
        name,
        email,
        phone,
        password: passwordHash,
      })

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: newUser,
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erro ao criar usuário', error })
    }
  }

}
