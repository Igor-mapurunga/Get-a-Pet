const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res) => {


    //cria o token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret")

    //retorna o token
    res.status(200).json({
        message: 'Voce está autenticado',
        token: token,
        userId: user.id,
    })
}

module.exports = createUserToken