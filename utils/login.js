import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
// const bcrypt = require('bcrypt')
import { Router } from 'express';
const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  const { nome, contrasinal } = request.body

  if (!(nome && contrasinal)) {
    return response.status(401).json({
      error: 'inválidos nome do usuario ou contrasinal'
    })
  }

  const rows = await db.query(
    `SELECT Nome AS nome, idUsuario AS idusuario, fkIdioma AS fkidioma FROM usuario WHERE Nome = '${nome}' AND pass = '${contrasinal}' AND ativado = true;`
  );
  if (rows.length === 0) {
    return response.status(401).json({
      error: 'inválidos nome do usuario ou contrasinal'
    })
  } else {
    const userForToken = {
      nome: rows[0].nome,
      id: rows[0].idusuario,
      idioma: rows[0].fkidioma
    }
    // o token expira em uma hora (60*60 segundos)
    const token = jwt.sign(userForToken, process.env.SEGREDO_PARA_O_TOKEN, { expiresIn: 60*60 });

    response
      .status(200)
      .send({ token, usuario: userForToken })
  }
})

export default loginRouter
