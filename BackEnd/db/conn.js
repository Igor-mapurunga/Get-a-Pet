const { Pool } = require('pg')

async function main () {
  // 1. Criar pool de conexões
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'GetAPet',
    password: '123@',
    port: 5432
  })

    try {
    // 2. Testar a conexão
    const result = await pool.query('SELECT NOW()')
    console.log('Conectado! Hora atual do banco:', result.rows[0])
  } catch (err) {
    console.error('Erro ao conectar no PostgreSQL:', err)
  }
}

main()