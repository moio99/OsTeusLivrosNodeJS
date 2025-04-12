const db = require('../utils/db');
const helper = require('../utils/helper');

async function getEditoriais(idUsuario){
  console.log('Petiçom de getEditoriais ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web  
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario}   
      ORDER BY lower(e.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function getEditorial(idUsuario, id){
  console.log('Petiçom de getEditorial ' + new Date().toJSON());
  const dadosEditorial = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.Direicom as direicom, e.web, e.Comentario as comentario  
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario} AND e.idEditorial = ${id} ;`
  );
  
  const editorial = helper.emptyOrRows(dadosEditorial);
  console.log(editorial.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    editorial,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getEditorialPorNome(idUsuario, nome){
  console.log('Petiçom de getEditorialPorNome ' + new Date().toJSON());
  const dadosEditorial = await db.query(
    `SELECT e.idEditorial as id
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario} AND e.Nome like '%${nome}%' ;`
  );
  
  const editorial = helper.emptyOrRows(dadosEditorial);
  console.log(editorial.length + ' elementos devoltos');

  const meta = {'id': editorial.length > 0 ? editorial[0].id : 0, 'quantidade': editorial.length};

  return {
    editorial,
    meta
  }
}

async function getEditoriaisCosLivros(idUsuario){
  console.log('Petiçom de getEditoriaisCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web, COUNT(l.idLivro) as quantidadeLivros 
      FROM Editorial e
      LEFT JOIN Livro l on l.fkEditorial = e.idEditorial
      WHERE e.fkUsuario = ${idUsuario}
      GROUP BY e.idEditorial
      ORDER BY lower(e.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function postEditorial(idUsuario, editorial){
  console.log('Petiçom de postEditorial ' + editorial.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO Editorial
    (fkUsuario, Nome, Direicom, web, Comentario)
  VALUES (${idUsuario}, ?, ?, ?, ?)`;

  const dadosInsert = [
    editorial.nome,
    editorial.direicom,
    editorial.web,
    editorial.comentario
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' editorial creada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putEditorial(idUsuario, editorial){
  console.log('Petiçom de putEditorial ' + editorial.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `UPDATE Editorial SET
      Nome = ?,
      Direicom = ?,
      web = ?,
      Comentario = ?
    WHERE idEditorial = ? AND fkUsuario = ?;`;
  const dadosInsert = [
    db.stringOuNullSimple(editorial.nome),
    db.stringOuNullSimple(editorial.direicom),
    db.stringOuNullSimple(editorial.web),
    db.stringOuNullSimple(editorial.comentario),
    editorial.id,
    idUsuario
  ];
  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = editorial.id;
    }
  );
  
  console.log('id: ' + idResult + ' editorial actualizada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarEditorial(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM Editorial WHERE idEditorial = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' editorial borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getEditoriais, getEditoriaisCosLivros, getEditorial, getEditorialPorNome, postEditorial, putEditorial, borrarEditorial
}
