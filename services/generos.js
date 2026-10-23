import db from '../utils/db.js';
import helper from '../utils/helper.js';

async function getGeneros(idUsuario){
  console.log('💬 Petiçom de getGeneros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT g.idGenero as id, g.Nome as nome
      FROM Genero g
      WHERE g.fkUsuario = ${idUsuario}   
      ORDER BY lower(g.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function getGenero(idUsuario, id){
  console.log('💬 Petiçom de getGenero ' + new Date().toJSON());
  const dadosGenero = await db.query(
    `SELECT e.idGenero as id, e.Nome as nome, e.Comentario as comentario  
      FROM Genero e
      WHERE e.fkUsuario = ${idUsuario} AND e.idGenero = ${id} ;`
  );
  
  const genero = helper.emptyOrRows(dadosGenero);
  console.log(`✅ ${genero.length} elementos obtidos`);

  const meta = {'id': id};

  return {
    data: genero,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getGeneroPorNome(idUsuario, nome){
  console.log('💬 Petiçom de getGeneroPorNome ' + new Date().toJSON());
  const dadosGenero = await db.query(
    `SELECT g.idGenero as id
      FROM Genero g
      WHERE g.fkUsuario = ${idUsuario} AND LOWER(g.Nome) = LOWER('${nome}') ;`
  );
  
  const genero = helper.emptyOrRows(dadosGenero);
  console.log(`✅ ${genero.length} elementos obtidos`);

  const meta = {'id': genero.length > 0 ? genero[0].id : 0, 'quantidade': genero.length};

  return {
    data: genero,
    meta
  }
}

async function getGeneroNome(idUsuario, id){
  console.log('💬 Petiçom de getGeneroNome ' + new Date().toJSON());
  const dadosGenero = await db.query(
    `SELECT e.Nome as nome
      FROM Genero e
      WHERE e.fkUsuario = ${idUsuario} AND e.idGenero = ${id} ;`
  );
  
  const genero = helper.emptyOrRows(dadosGenero);
  if (genero) {
    console.log(`Nome ${genero[0].nome} obtido`);
    return genero[0].nome;
  }
  else
    return null;
}

async function getGenerosCosLivros(idUsuario){
  console.log('💬 Petiçom de getGenerosCosLivros ' + new Date().toJSON());
  const quantidade = db.ePosgreSQL() ?
      `SUM(CASE WHEN l.Lido THEN 1 ELSE 0 END)::integer as "quantidadeLidos", COUNT(l.idLivro)::integer as "quantidadeLivros"`
    : 'SUM(l.Lido) as quantidadeLidos, COUNT(l.idLivro) as quantidadeLivros';
  const dadosGeneros = await db.query(
    `SELECT g.idGenero as id, g.Nome as nome, ${quantidade} 
      FROM Genero g
      LEFT JOIN Generos gs ON gs.fkGenero = g.idGenero
      LEFT JOIN Livro l on l.idLivro = gs.fkLivro
      WHERE g.fkUsuario = ${idUsuario}
      GROUP BY g.idGenero, g.Nome
      ORDER BY lower(g.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosGeneros);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function postGenero(idUsuario, genero){
  console.log('💬 Petiçom de postGenero ' + genero.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const c = { indice: 0 };
  let queryInsert = `INSERT INTO Genero
    (fkUsuario, Nome, Comentario)
    VALUES (${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)})
    ${db.ePosgreSQL() ? 'RETURNING idgenero' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('Genero', 'idgenero'), 
          (SELECT COALESCE(MAX(idgenero), 0) + 1 FROM Genero), 
          false
      );
 */

  const dadosInsert = [
    idUsuario,
    genero.nome,
    genero.comentario
  ];

  const resultado = await db.query(queryInsert, dadosInsert);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idgenero;
    }
  } else {
    idResult = resultado.insertId || (resultado[0] && resultado[0].insertId);
  }
  
  console.log('✅ id: ' + idResult + ' genero creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putGenero(idUsuario, genero){
  console.log('💬 Petiçom de putGenero ' + genero.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  let queryUpdate = `UPDATE Genero SET
      Nome = ${db.qId(c)},
      Comentario = ${db.qId(c)}
    WHERE idGenero = ${db.qId(c)} AND fkUsuario = ${db.qId(c)};`;

  const dadosUpdate = [
    db.stringOuNullSimple(genero.nome),
    db.stringOuNullSimple(genero.comentario),
    genero.id,
    idUsuario
  ];
  await db.query(queryUpdate, dadosUpdate).then(ResultSetHeader => {
    if (db.ePosgreSQL()) {
      idResult = ResultSetHeader[0].idgenero;
    } else if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
      idResult = genero.id;
    }
  );
  
  console.log('✅ id: ' + idResult + ' genero actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarGenero(idUsuario, id) {
  console.log(`💬 id pra borrar: ${id}`);
  let idResult = 0;
  const c = { indice: 0 };

  const resultado = await db.query(
    `DELETE FROM Genero WHERE idGenero = ${db.qId(c)} AND fkUsuario = ${db.qId(c)};`,
    [id, idUsuario]
  );

  const filasBorradas = db.ePosgreSQL() 
    ? resultado.rowCount
    : (resultado.affectedRows || (resultado && resultado.affectedRows));

  if (filasBorradas === 1) {
    idResult = id;
  }

  console.log(`✅ id: ${idResult} Genero borrado 🔴`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

export default {
  getGeneros, getGenerosCosLivros, getGenero, getGeneroPorNome, getGeneroNome
  , postGenero, putGenero, borrarGenero
}
