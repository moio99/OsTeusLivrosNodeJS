const db = require('../utils/db');
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  console.log('Petiçom de login');
  const { nome, contrasinal } = request.body

  if (!(nome && contrasinal)) {
    return response.status(401).json({
      error: 'inválidos nome do usuario ou contrasinal'
    })
  }

  console.log('Vou a pola query');
  const rows = await db.query(
    `SELECT * FROM Usuario WHERE Nome = '${nome}' AND Pass = '${contrasinal}' AND Ativado = 1;`
  );
  if (rows.length === 0) {
    return response.status(401).json({
      error: 'inválidos nome do usuario ou contrasinal'
    })
  } else {
    const userForToken = {
      nome: rows[0].Nome,
      id: rows[0].idUsuario,
      idioma: rows[0].fkIdioma
    }
    // o token expira em uma hora (60*60 segundos)
    const token = jwt.sign(userForToken, process.env.SEGREDO_PARA_O_TOKEN, { expiresIn: 60*60 });

    response
      .status(200)
      .send({ token, usuario: userForToken })
  }
})

module.exports = loginRouter