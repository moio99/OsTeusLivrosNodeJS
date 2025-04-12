const db = require('../utils/db');
const helper = require('../utils/helper');

async function getGeneros(idUsuario){
  console.log('Petiçom de getGeneros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT g.idGenero as id, e.Nome as nome
      FROM Genero g
      WHERE g.fkUsuario = ${idUsuario}   
      ORDER BY lower(g.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function getGenero(idUsuario, id){
  console.log('Petiçom de getGenero ' + new Date().toJSON());
  const dadosGenero = await db.query(
    `SELECT e.idGenero as id, e.Nome as nome, e.Comentario as comentario  
      FROM Genero e
      WHERE e.fkUsuario = ${idUsuario} AND e.idGenero = ${id} ;`
  );
  
  const genero = helper.emptyOrRows(dadosGenero);
  console.log(genero.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    genero,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getGeneroPorNome(idUsuario, nome){
  console.log('Petiçom de getGeneroPorNome ' + new Date().toJSON());
  const dadosGenero = await db.query(
    `SELECT g.idGenero as id
      FROM Genero g
      WHERE g.fkUsuario = ${idUsuario} AND LOWER(g.Nome) = LOWER('${nome}') ;`
  );
  
  const genero = helper.emptyOrRows(dadosGenero);
  console.log(genero.length + ' elementos devoltos');

  const meta = {'id': genero.length > 0 ? genero[0].id : 0, 'quantidade': genero.length};

  return {
    genero,
    meta
  }
}

async function getGeneroNome(idUsuario, id){
  console.log('Petiçom de getGeneroNome ' + new Date().toJSON());
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
  console.log('Petiçom de getGenerosCosLivros ' + new Date().toJSON());
  const dadosGeneros = await db.query(
    `SELECT g.idGenero as id, g.Nome as nome, COUNT(l.idLivro) as quantidadeLivros, CONVERT(SUM(l.Lido), UNSIGNED) as quantidadeLidos
      FROM Genero g
      LEFT JOIN Generos gs ON gs.fkGenero = g.idGenero
      LEFT JOIN Livro l on l.idLivro = gs.fkLivro
      WHERE g.fkUsuario = ${idUsuario}
      GROUP BY g.idGenero
      ORDER BY lower(g.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosGeneros);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function postGenero(idUsuario, genero){
  console.log('Petiçom de postGenero ' + genero.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO Genero
    (fkUsuario, Nome, Comentario)
  VALUES (?, ?, ?)`;

  const dadosInsert = [
    idUsuario,
    genero.nome,
    genero.comentario
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' genero creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putGenero(idUsuario, genero){
  console.log('Petiçom de putGenero ' + genero.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `UPDATE Genero SET
      Nome = ?,
      Comentario = ?
    WHERE idGenero = ? AND fkUsuario = ?;`;
  const dadosInsert = [
    db.stringOuNullSimple(genero.nome),
    db.stringOuNullSimple(genero.comentario),
    genero.id,
    idUsuario
  ];
  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = genero.id;
    }
  );
  
  console.log('id: ' + idResult + ' genero actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarGenero(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM Genero WHERE idGenero = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' genero borrado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getGeneros, getGenerosCosLivros, getGenero, getGeneroPorNome, getGeneroNome
  , postGenero, putGenero, borrarGenero
}
