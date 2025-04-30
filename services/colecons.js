const db = require('../utils/db');
const helper = require('../utils/helper');

async function getColecons(idUsuario){
  console.log('Petiçom de getColecons ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT c.idColecom as id, c.Nome as nome, c.web  
      FROM Colecom c
      WHERE c.fkUsuario = ${idUsuario}   
      ORDER BY lower(c.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function getColecom(idUsuario, id){
  console.log('Petiçom de getColecom ' + new Date().toJSON());
  const dadosColecom = await db.query(
    `SELECT c.idColecom as id, c.Nome as nome, c.ISBN as isbn, c.web, c.Comentario as comentario
      FROM Colecom c
      WHERE c.fkUsuario = ${idUsuario} AND c.idColecom = ${id} ;`
  );
  
  const colecom = helper.emptyOrRows(dadosColecom);
  console.log(colecom.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    colecom,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getColecomPorNome(idUsuario, nome){
  console.log('Petiçom de getColecomPorNome ' + new Date().toJSON());
  const dadosColecom = await db.query(
    `SELECT c.idColecom as id
      FROM Colecom c
      WHERE c.fkUsuario = ${idUsuario} AND c.Nome like '%${nome}%' ;`
  );
  
  const colecom = helper.emptyOrRows(dadosColecom);
  console.log(colecom.length + ' elementos devoltos');

  const meta = {'id': colecom.length > 0 ? colecom[0].id : 0, 'quantidade': colecom.length};

  return {
    colecom,
    meta
  }
}

async function getColeconsCosLivros(idUsuario){
  console.log('Petiçom de getColeconsCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT c.idColecom as id, c.Nome as nome, c.web, COUNT(l.idLivro) as "quantidadeLivros"
      FROM Colecom c
      LEFT JOIN Livro l on l.fkColecom = c.idColecom
      WHERE c.fkUsuario = ${idUsuario}
      GROUP BY c.idColecom
      ORDER BY lower(c.Nome) ASC;`
  );

  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function postColecom(idUsuario, colecom){
  console.log('Petiçom de postColecom ' + colecom.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO Colecom
    (fkUsuario, Nome, ISBN, web, Comentario)
  VALUES (?, ?, ?, ?, ?)`;

  const dadosInsert = [
    idUsuario,
    colecom.nome,
    db.stringOuNullSimple(colecom.isbn),
    db.stringOuNullSimple(colecom.web),
    db.stringOuNullSimple(colecom.comentario)
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' colecom creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putColecom(idUsuario, colecom){
  console.log('Petiçom de putColecom ' + colecom.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `UPDATE Colecom SET
      Nome = ?,
      ISBN = ?,
      web = ?,
      Comentario = ?
    WHERE idColecom = ? AND fkUsuario = ?;`;

  const dadosInsert = [
    db.stringOuNullSimple(colecom.nome),    
    db.stringOuNullSimple(colecom.isbn),
    db.stringOuNullSimple(colecom.web),
    db.stringOuNullSimple(colecom.comentario),    
    colecom.id,
    idUsuario
  ];
  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = colecom.id;
    }
  );
  
  console.log('id: ' + idResult + ' colecom actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarColecom(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM Colecom WHERE idColecom = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' colecom borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getColecons, getColeconsCosLivros, getColecom, getColecomPorNome, postColecom, putColecom, borrarColecom
}