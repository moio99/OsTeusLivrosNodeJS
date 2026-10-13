import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
// const bcrypt = require('bcrypt')
import { Router } from 'express';
const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  let { nome, contrasinal } = request.body
  const { username, password } = request.body; // Swagger enviará isto no body

  console.log(nome, contrasinal);
  console.log(username, password);
  if (username && password) {
    nome = username;
    contrasinal = password;
  }

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
    const token_type = 'bearer';

    response.status(200).send({
      ...(username ? { access_token: token } : { token: token }),
      ...(username ? { token_type: 'bearer' } : { }),
      usuario: userForToken
    });

  }
})

export default loginRouter
