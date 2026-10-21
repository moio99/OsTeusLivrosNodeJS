import db from '../utils/db.js';
import helper from '../utils/helper.js';
import jwt from 'jsonwebtoken';
// const bcrypt = require('bcrypt')

async function getUsuarioPorNome(nome){
  console.log('💬 Petiçom de getUsuarioNome ' + new Date().toJSON());
  const dadosUsuario = await db.query(
    `SELECT u.Nome as nome
      FROM usuario u
      WHERE LOWER(u.Nome) = LOWER('${nome}') ;`
  );
  
  const usuario = helper.emptyOrRows(dadosUsuario);
  console.log(`✅ ${usuario.length} elementos obtidos`);

  const meta = {'id': usuario.length > 0 ? usuario[0].id : 0, 'quantidade': usuario.length};

  return {
    data: usuario,
    meta
  }
}

async function postUsuario(usuario){
  console.log('💬 Petiçom de postUsuario ' + usuario.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  let queryInsert = `INSERT INTO usuario
    (Nome, pass, Pergunta, Contestacom, Correio, fkIdioma)
    ${db.ePosgreSQL() ? 
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING idUsuario' 
      : 'VALUES (?, ?, ?, ?, ?, ?)'}`;
  console.log('db.ePosgreSQL()', db.ePosgreSQL());
  console.log('queryInsert', queryInsert);

  const dadosInsert = [
    usuario.nome,
    usuario.pass,
    usuario.pergunta,
    usuario.contestacom,
    usuario.correio,
    usuario.idIdioma,
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
    if (db.ePosgreSQL()) {
      idResult = ResultSetHeader[0].idUsuario;
    } else if (ResultSetHeader.affectedRows == 1)
      idResult = ResultSetHeader.insertId
    }  
  );
  
  console.log('✅ id: ' + idResult + ' usuario creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function postLogin(nome, contrasinal, loginSwagger){
  const rows = await db.query(
    `SELECT Nome AS nome, idUsuario AS idusuario, fkIdioma AS fkidioma FROM usuario 
      WHERE Nome = '${nome}' AND pass = '${contrasinal}' AND ativado = true;`
  );
  if (rows.length === 0) {
    return { error: 'inválidos nome do usuario ou contrasinal' };
  } else {
    const userForToken = {
      nome: rows[0].nome,
      id: rows[0].idusuario,
      idioma: rows[0].fkidioma
    }
    // o token expira em uma hora (60*60 segundos)
    const token = jwt.sign(userForToken, process.env.SEGREDO_PARA_O_TOKEN, { expiresIn: 60*60 });
        
    return {
      ...(loginSwagger ? { access_token: token } : { token: token }),
      ...(loginSwagger ? { token_type: 'bearer' } : { }),
      usuario: userForToken
    }
  }
}

export default { getUsuarioPorNome, postUsuario, postLogin }


// loginRouter.post('/', async (request, response) => {
//   let { nome, contrasinal } = request.body
//   const { username, password } = request.body; // Swagger enviará isto no body

//   if (username && password) {
//     nome = username;
//     contrasinal = password;
//   }

//   if (!(nome && contrasinal)) {
//     return response.status(401).json({
//       error: 'inválidos nome do usuario ou contrasinal'
//     })
//   }

//   const rows = await db.query(
//     `SELECT Nome AS nome, idUsuario AS idusuario, fkIdioma AS fkidioma FROM usuario WHERE Nome = '${nome}' AND pass = '${contrasinal}' AND ativado = true;`
//   );
//   if (rows.length === 0) {
//     return response.status(401).json({
//       error: 'inválidos nome do usuario ou contrasinal'
//     })
//   } else {
//     const userForToken = {
//       nome: rows[0].nome,
//       id: rows[0].idusuario,
//       idioma: rows[0].fkidioma
//     }
//     // o token expira em uma hora (60*60 segundos)
//     const token = jwt.sign(userForToken, process.env.SEGREDO_PARA_O_TOKEN, { expiresIn: 60*60 });
    
//     response.status(200).send({
//      // Os dous seguintes só som necesarios para o login do swagger
//       ...(username ? { access_token: token } : { token: token }),
//       ...(username ? { token_type: 'bearer' } : { }),
//       usuario: userForToken
//     });

//   }
// })