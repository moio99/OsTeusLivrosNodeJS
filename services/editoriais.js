const db = require('./db');
const helper = require('../helper');

async function getEditoriais(){
  console.log('Petiçom de getEditoriais ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web  
      FROM Editorial e
      WHERE e.fkUsuario = 2   
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

async function getEditorial(id){
  console.log('Petiçom de getEditorial ' + new Date().toJSON());
  const dadosEditorial = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.Direicom as direicom, e.web, e.Comentario as comentario  
      FROM Editorial e
      WHERE e.fkUsuario = 2 AND e.idEditorial = ${id} ;`
  );
  
  const editorial = helper.emptyOrRows(dadosEditorial);
  console.log(editorial.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    editorial,
    meta
  }
}

async function getEditoriaisCosLivros(){
  console.log('Petiçom de getEditoriaisCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web, COUNT(l.idLivro) as quantidadeLivros 
      FROM Editorial e
      LEFT JOIN Livro l on l.fkEditorial = e.idEditorial
      WHERE e.fkUsuario = 2
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

async function postEditorial(editorial){
  console.log('Petiçom de postEditorial ' + editorial.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO Editorial
    (fkUsuario, Nome, Direicom, web, Comentario)
  VALUES (2, ?, ?, ?, ?)`;

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

async function putEditorial(editorial){
  console.log('Petiçom de putEditorial ' + editorial.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `UPDATE Editorial SET
      Nome = ?,
      Direicom = ?,
      web = ?,
      Comentario = ?
    WHERE idEditorial = ?;`;
  const dadosInsert = [
    db.stringOuNullSimple(editorial.nome),
    db.stringOuNullSimple(editorial.direicom),
    db.stringOuNullSimple(editorial.web),
    db.stringOuNullSimple(editorial.comentario),
    editorial.id
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

async function borrarEditorial(id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM Editorial WHERE idEditorial = ${id};`
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
  getEditoriais, getEditoriaisCosLivros, getEditorial, postEditorial, putEditorial, borrarEditorial
}
