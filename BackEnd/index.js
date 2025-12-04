const express = require('express')
const cors = require('cors')
const sequelize = require('./db/conn')

// Models
require('./models/User')

const app = express()

// Middleware JSON
app.use(express.json())

// CORS
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5000'
}))

// Pasta pública
app.use(express.static('public'))

// Rotas
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

// Teste de conexão + sync
sequelize.sync().then(() => {
  console.log('📦 Banco sincronizado')
}).catch(err => {
  console.error('❌ Erro ao sincronizar banco:', err)
})

// Iniciar servidor
app.listen(5000, () => {
  console.log('🚀 Servidor rodando na porta 5000')
})
