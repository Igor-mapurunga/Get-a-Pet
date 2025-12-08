const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  try {
    // cria o token com Sequelize (id correto)
    const token = jwt.sign(
      {
        id: user.id,   // <-- AGORA CERTO
        name: user.name
      },
      "nossosecret",
      {
        expiresIn: "7d"
      }
    );

    // retorna o token
    res.status(200).json({
      message: "Você está autenticado",
      token: token,
      userId: user.id,  // <-- Sequelize usa id
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao gerar token" });
  }
};

module.exports = createUserToken;
