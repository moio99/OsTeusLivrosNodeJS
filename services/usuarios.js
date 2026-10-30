import db from '../utils/db.js';
import helper from '../utils/helper.js';
import jwt from 'jsonwebtoken';
// const bcrypt = require('bcrypt')

async function getUsuarioPorNome(nome){
  console.log('💬 Petiçom de getUsuarioPorNome ' + new Date().toJSON());
  const dadosUsuario = await db.query(
    `SELECT u.idUsuario as id
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

async function getUsuarioPorId(id){
  console.log('💬 Petiçom de getUsuarioPorId ' + new Date().toJSON());
  const dadosUsuario = await db.query(
    `SELECT 
      u.idUsuario AS "idUsuario",
      u.pass,
      u.Nome AS nome,
      u.Pergunta AS pergunta,
      u.Contestacom AS contestacom,
      u.Correio AS correio,
      u.fkIdioma AS "idIdioma",
      u.Ativado AS ativado
      FROM usuario u
      WHERE u.idUsuario = ${id};`
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
  const c = { indice: 0 };
  let queryInsert = `INSERT INTO usuario
    (Nome, pass, Pergunta, Contestacom, Correio, fkIdioma, ativado)
    VALUES (${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, 
            ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}) 
    ${db.ePosgreSQL() ? 'RETURNING idusuario' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('usuario', 'idusuario'), 
          (SELECT COALESCE(MAX(idusuario), 0) + 1 FROM usuario), 
          false
      );
 */

  const dadosInsert = [
    usuario.nome,
    usuario.pass,
    usuario.pergunta,
    usuario.contestacom,
    usuario.correio,
    usuario.idIdioma,
    usuario.ativado,
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
  
async function putUsuario(usuario){
  console.log('💬 Petiçom de putUsuario id: ' + usuario.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  let queryUpdate = `UPDATE usuario SET
      Nome = ${db.qId(c)},
      pass = ${db.qId(c)},
      Pergunta = ${db.qId(c)},
      Contestacom = ${db.qId(c)},
      Correio = ${db.qId(c)},
      fkIdioma = ${db.qId(c)}
    WHERE idUsuario = ${db.qId(c)}
    ${db.ePosgreSQL() ? 'RETURNING idUsuario;' : ';'}`;

  const dadosUpdate = [
    db.stringOuNullSimple(usuario.nome),
    db.stringOuNullSimple(usuario.pass),
    db.stringOuNullSimple(usuario.pergunta),
    db.stringOuNullSimple(usuario.contestacom),
    db.stringOuNullSimple(usuario.correio),
    db.stringOuNullSimple(usuario.idIdioma),
    usuario.id
  ];
  const resultado = await db.query(queryUpdate, dadosUpdate);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idUsuario;
    }
  } else {
    idResult = resultado.updatedId || (resultado[0] && resultado[0].updatedId);
  }
  
  console.log('✅ id: ' + idResult + ' usuario actualizado');
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

export default { getUsuarioPorNome, getUsuarioPorId, postUsuario, postLogin, putUsuario }