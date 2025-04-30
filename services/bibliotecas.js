const db = require('../utils/db');
const helper = require('../utils/helper');

async function getBibliotecas(idUsuario){
  console.log('Petiçom de getBibliotecas ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.DataRenovacom as dataRenovacom  
      FROM Biblioteca b
      WHERE b.fkUsuario = ${idUsuario}   
      ORDER BY lower(b.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function getBiblioteca(idUsuario, id){
  console.log('Petiçom de getBiblioteca ' + new Date().toJSON());
  const dadosBiblioteca = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.Endereco as Endereco, b.Localidade as localidade
      , b.Telefone as telefone, b.DataAsociamento as dataAsociamento, b.DataRenovacom as dataRenovacom
      , b.Comentario as comentario
      FROM Biblioteca b
      WHERE b.fkUsuario = ${idUsuario} AND b.idBiblioteca = ${id} ;`
  );
  
  const biblioteca = helper.emptyOrRows(dadosBiblioteca);
  console.log(biblioteca.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    biblioteca,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getBibliotecaPorNome(idUsuario, nome){
  console.log('Petiçom de getBibliotecaPorNome ' + new Date().toJSON());
  const dadosBiblioteca = await db.query(
    `SELECT b.idBiblioteca as id
      FROM Biblioteca b
      WHERE b.fkUsuario = ${idUsuario} AND b.Nome like '%${nome}%' ;`
  );
  
  const biblioteca = helper.emptyOrRows(dadosBiblioteca);
  console.log(biblioteca.length + ' elementos devoltos');

  const meta = {'id': biblioteca.length > 0 ? biblioteca[0].id : 0, 'quantidade': biblioteca.length};

  return {
    biblioteca,
    meta
  }
}

async function getBibliotecasCosLivros(idUsuario){
  console.log('Petiçom de getBibliotecasCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.DataRenovacom as "dataRenovacom", COUNT(l.idLivro) as "quantidadeLivros"
      FROM Biblioteca b
      LEFT JOIN Livro l on l.fkBiblioteca = b.idBiblioteca
      WHERE b.fkUsuario = ${idUsuario}
      GROUP BY b.idBiblioteca
      ORDER BY lower(b.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(data.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    data,
    meta
  }
}

async function postBiblioteca(idUsuario, biblioteca){
  console.log('Petiçom de postBiblioteca ' + biblioteca.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO Biblioteca
    (fkUsuario, Nome, Endereco, Localidade, Telefone, DataAsociamento, DataRenovacom, Comentario)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const dadosInsert = [
    idUsuario,
    biblioteca.nome,
    db.stringOuNullSimple(biblioteca.endereco),
    db.stringOuNullSimple(biblioteca.localidade),
    db.stringOuNullSimple(biblioteca.telefone),
    db.stringOuNullSimple(biblioteca.dataAsociamento),
    db.stringOuNullSimple(biblioteca.dataRenovacom),
    db.stringOuNullSimple(biblioteca.comentario)
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' biblioteca creada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putBiblioteca(idUsuario, biblioteca){
  console.log('Petiçom de putBiblioteca ' + biblioteca.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `UPDATE Biblioteca SET
      Nome = ?,
      Endereco = ?,
      Localidade = ?,
      Telefone = ?,
      DataAsociamento = ?,
      DataRenovacom = ?,
      Comentario = ?
    WHERE idBiblioteca = ? AND fkUsuario = ?;`;

  const dadosInsert = [
    db.stringOuNullSimple(biblioteca.nome),    
    db.stringOuNullSimple(biblioteca.endereco),
    db.stringOuNullSimple(biblioteca.localidade),
    db.stringOuNullSimple(biblioteca.telefone),
    db.stringOuNullSimple(biblioteca.dataAsociamento),
    db.stringOuNullSimple(biblioteca.dataRenovacom),
    db.stringOuNullSimple(biblioteca.comentario),    
    biblioteca.id,
    idUsuario
  ];
  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = biblioteca.id;
    }
  );
  
  console.log('id: ' + idResult + ' biblioteca actualizada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarBiblioteca(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM Biblioteca WHERE idBiblioteca = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' biblioteca borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getBibliotecas, getBibliotecasCosLivros, getBiblioteca, getBibliotecaPorNome, postBiblioteca, putBiblioteca, borrarBiblioteca
}
