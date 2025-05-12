const db = require('../utils/db');
const helper = require('../utils/helper');

async function getRelectura(idUsuario, idRelectura){
  console.log('Petiçom de getRelectura ' + new Date().toJSON() + ' idRelectura: ' + idRelectura);
  const dataSelect = process.env.QUAL_SQL?.length > 8 && process.env.QUAL_SQL?.substring(0, 9) === 'PosgreSQL' ?
      `, TO_CHAR(r.DataFimLeitura, 'DD/MM/YYYY') as dataFimLeitura
       , TO_CHAR(r.DataEdicom, 'DD/MM/YYYY') as dataEdicom`
    : `, DATE_FORMAT(r.DataFimLeitura,'%d/%m/%Y') as dataFimLeitura
       , DATE_FORMAT(r.DataEdicom,'%d/%m/%Y') as dataEdicom`;
  let query = `SELECT
      r.idRelectura as id, r.fkLivro, r.titulo
      , b.idBiblioteca, b.Nome as biblioteca
      , e.idEditorial, e.Nome as editorial
      , c.idColecom, c.Nome as colecom
      , r.ISBN as isbn
      , r.Paginas as paginas, r.PaginasLidas as paginasLidas, r.Lido as lido, r.TempoLeitura as diasLeitura
      ${dataSelect}
      , r.fkIdioma as idIdioma
      , r.NumeroEdicom as numeroEdicom, r.Electronico as electronico
      , r.SomSerie as somSerie, r.idSerie, r.Comentario as comentario, r.Pontuacom as pontuacom
    FROM Relectura r
    LEFT JOIN Biblioteca b ON r.fkBiblioteca = b.idBiblioteca 
    LEFT JOIN Editorial e ON r.fkEditorial = e.idEditorial 
    LEFT JOIN Colecom c ON r.fkColecom = c.idColecom 
    WHERE r.idRelectura = ${idRelectura} AND r.fkUsuario = ${idUsuario};`;
  const dadosRelectura = await db.query(query);
  
  const data = helper.emptyOrRows(dadosRelectura);
  console.log(data.length + ' elementos devoltos');

  const meta = {'id': idRelectura};

  return {
    data,
    meta
  }
}

async function getRelecturas(idUsuario, idLivro){
  console.log('Petiçom de getRelecturas ' + new Date().toJSON() + ' idLivro: ' + idLivro);
  let query = `SELECT r.idRelectura id, r.titulo, r.paginas, r.lido, r.DataFimLeitura as "dataFimLeitura"
      , r.TempoLeitura as "diasLeitura", r.pontuacom
      FROM Relectura r
      WHERE r.fkUsuario = ${idUsuario} AND r.fkLivro =  ${idLivro}`;
  const dados = await db.query(query);
  
  const data = helper.emptyOrRows(dados);
  console.log(data.length + ' relecturas devoltas');

  const meta = {'idLivro': idLivro, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function postRelectura(idUsuario, relectura){
  console.log('Petiçom de postRelectura ' + relectura.titulo + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `
    INSERT INTO Relectura
      (fkUsuario, fkLivro, Titulo, fkBiblioteca, fkEditorial, fkColecom, ISBN, 
       Electronico, Paginas, PaginasLidas, Lido, TempoLeitura, DataFimLeitura, fkIdioma,
       DataEdicom, NumeroEdicom, Comentario, Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie)
     VALUES
      (?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, 3, ?, ?);`;

  const dadosInsert = [
    idUsuario,
    db.numberOuNull(relectura.idLivro),
    db.stringOuNullSimple(relectura.titulo),
    db.numberOuNull(relectura.idBiblioteca),
    db.numberOuNull(relectura.idEditorial),
    db.numberOuNull(relectura.idColecom),
    db.stringOuNullSimple(relectura.isbn),

    relectura.electronico ? 1 : 0,
    db.numberOuNull(relectura.paginas),
    db.numberOuNull(relectura.paginasLidas),
    relectura.lido ? 1 : 0,
    db.stringOuNullSimple(relectura.diasLeitura),
    db.stringOuNullSimple(relectura.dataFimLeitura),
    db.numberOuNull(relectura.idIdioma),

    db.stringOuNullSimple(relectura.dataEdicom),
    db.numberOuNull(relectura.numeroEdicom),
    db.stringOuNullSimple(relectura.comentario),
    db.numberOuNull(relectura.pontuacom),
    relectura.somSerie ? 1 : 0,
    db.numberOuNull(relectura.idSerie)
  ];

  await db.query(queryInsert, dadosInsert)
    .then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
    
  console.log('id: ' + idResult + ' relectura creada');
  
  return {
    idResult
  }
}

async function putRelectura(idUsuario, relectura){
  console.log('Petiçom de putRelectura ' + relectura.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  
  const queryInsert = `UPDATE Relectura SET
    Titulo = ?,
    fkBiblioteca = ?,
    fkEditorial = ?,
    fkColecom = ?,
    ISBN = ?,
    Electronico = ?,
    Paginas = ?,
    PaginasLidas = ?,
    Lido = ?,
    TempoLeitura = ?,
    DataFimLeitura = ?,
    fkIdioma = ?,
    DataEdicom = ?,
    NumeroEdicom = ?,
    Comentario = ?,
    Pontuacom = ?,
    fkIdiomaDaEntrada = 3,
    SomSerie = ?,
    idSerie = ?
    WHERE idRelectura = ? AND fkUsuario = ?;`;

  const dadosInsert = [
    relectura.titulo,
    db.numberOuNull(relectura.idBiblioteca),
    db.numberOuNull(relectura.idEditorial),
    db.numberOuNull(relectura.idColecom),
    db.stringOuNullSimple(relectura.isbn),
    relectura.electronico ? 1 : 0,
    db.numberOuNull(relectura.paginas),
    db.numberOuNull(relectura.paginasLidas),
    relectura.lido ? 1 : 0,
    db.numberOuNull(relectura.diasLeitura),
    db.stringOuNullSimple(relectura.dataFimLeitura),
    db.numberOuNull(relectura.idIdioma),
    db.stringOuNullSimple(relectura.dataEdicom),
    db.numberOuNull(relectura.numeroEdicom),
    db.stringOuNullSimple(relectura.comentario),
    db.numberOuNull(relectura.pontuacom),
    relectura.somSerie ? 1 : 0,
    relectura.idSerie,
    relectura.id,
    idUsuario
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      console.log(ResultSetHeader);
      if (ResultSetHeader.affectedRows == 1)
        idResult = relectura.id;
    }
  );
  
  console.log('id: ' + idResult + ' relectura actualizada');
  return {
    idResult
  }
}

async function borrarRelectura(idUsuario, id) {
  console.log('id para borrar: ' + id);
  let idResult = 0;

  await db.query(
    `DELETE FROM Relectura WHERE idRelectura = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' relectura borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getRelectura, getRelecturas, postRelectura, putRelectura, borrarRelectura
}
