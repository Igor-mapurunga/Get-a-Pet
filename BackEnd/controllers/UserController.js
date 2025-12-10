const User = require('../models/User')
const bcrypt = require('bcryptjs')

//Import dos helpers
const getUserByToken = require('../helpers/get-user-by-token')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

const jwt = require('jsonwebtoken')
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
      res.status(401).json({ message: 'Email ou Senha invalidos' })
      return
    }


    await createUserToken(user, req, res)
  }

  static async checkUser(req, res) {

    console.log("AUTH HEADER RECEBIDO:", req.headers.authorization);

    let currentUser

    console.log(req.headers.authorization)

    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 'nossosecret')

      currentUser = await User.findByPk(decoded.id)


    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {

    const id = req.params.id

    const user = await User.findByPk(id)

    if (!user) res.status(422).json({ message: 'O nome é obrigatório' })


    return res.status(200).json({ user })
  }

  static async editUser(req, res) {

    const id = req.params.id;

    const token = getToken(req)
    const user = await getUserByToken(token)

    const { name, email, phone, password, confirmpassword } = req.body

    let image = ''

    if(req.file){
      user.image = req.file.filename
    }

    //validations
    if (!name) return res.status(422).json({ message: 'O nome é obrigatório' })
    if (!email) return res.status(422).json({ message: 'O email é obrigatório' })

    //Check if email has already taken
    const userExists = await User.findOne({ where: { email: email } })

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }

    user.email = email

    if (!phone) return res.status(422).json({ message: 'O telefone é obrigatório' })
    user.phone = phone

    if (password != confirmpassword) {
      res.status(422).json({ message: 'As senhas não conferem' })
      return
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      user.password = passwordHash
      console.log(user)
    }

    try {

      const userToUpdate = await User.findByPk(user.id)

      if (!userToUpdate) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }

      // Atualiza todos os campos que você já modificou no objeto `user`
      Object.assign(userToUpdate, user)

      await userToUpdate.save()

      return res.status(200).json({
        message: "Usuário alterado com sucesso",
        user: userToUpdate
      })

    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Erro ao atualizar usuário" })
    }

  }
}

