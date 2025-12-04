const User = require('../models/User')
const bcrypt = require('bcryptjs')
const createUserToken = require('../helpers/create-user-token')

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

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    })

    try {
      const newUser = await user.save()

      await createUserToken(newUser, req, res)
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }

  static async login(req, res) {
  const { email, password } = req.body

  if (!email) return res.status(422).json({ message: 'O e-mail é obrigatório' })
  if (!password) return res.status(422).json({ message: 'A senha é obrigatória' })

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.status(422).json({ message: 'Não existe usuario cadastrado com esse e-mail' })
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    return res.status(401).json({ message: 'Email ou Senha invalidos' })
  }

  
  await createUserToken(user, req, res)
}
}


