import db from '../utils/db.js';
import helper from '../utils/helper.js';
import Biblioteca from '../models/biblioteca.js';

async function getBibliotecas(idUsuario){
  console.log('💬 Petiçom de getBibliotecas' + new Date().toJSON());
  const p1 = db.ePosgreSQL() ? '$1' : '?';
  const dadosLivro = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.DataRenovacom as dataRenovacom  
      FROM Biblioteca b
      WHERE b.fkUsuario =  ${p1}
      ORDER BY lower(b.Nome) ASC;`,
      [idUsuario]
  );
  
  const rows = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${rows.length} elementos obtidos`);
  const data = rows.map(row => new Biblioteca.Biblioteca(row));

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function getBiblioteca(idUsuario, id){
  console.log('💬 Petiçom de getBiblioteca ' + new Date().toJSON());
  
  const p1 = db.ePosgreSQL() ? '$1' : '?';
  const p2 = db.ePosgreSQL() ? '$2' : '?';

  const dadosBiblioteca = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.Endereco as endereco, b.Localidade as localidade
      , b.Telefone as telefone, b.DataAsociamento as "dataAsociamento", b.DataRenovacom as "dataRenovacom"
      , b.Comentario as comentario
      FROM Biblioteca b
      WHERE b.fkUsuario = ${p1} AND b.idBiblioteca = ${p2} ;`,
    [idUsuario, id]
  );

  const rows = helper.emptyOrRows(dadosBiblioteca);
  console.log(`✅ ${rows.length} elementos obtidos`);
  const data = rows.map(row => new Biblioteca.BibliotecaDetalhe(row));   // Precisso voltar um listado inda que só tenha um elemento

  const meta = {'id': id};

  return {
    data: data,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getBibliotecaPorNome(idUsuario, nome){
  console.log('💬 Petiçom de getBibliotecaPorNome ' + new Date().toJSON());

  const p1 = db.ePosgreSQL() ? '$1' : '?';
  const p2 = db.ePosgreSQL() ? '$2' : '?';

  const dadosBiblioteca = await db.query(
    `SELECT b.idBiblioteca as id
      FROM Biblioteca b
      WHERE b.fkUsuario = ${p1} AND b.Nome LIKE ${p2};`,
    [idUsuario, `%${nome}%`]
  );
  
  const rows = helper.emptyOrRows(dadosBiblioteca);
  console.log(`✅ ${rows.length} elementos obtidos`);
  let data = null; 
  let meta = {'id': 0, 'quantidade': rows.length};
  if (rows.length > 0) {
    data = new Biblioteca.ElementoId(rows[0]);
    meta.id = data.id;
  }

  return {
    data: data,
    meta
  }
}

async function getBibliotecasCosLivros(idUsuario){
  console.log('💬 Petiçom de getBibliotecasCosLivros ' + new Date().toJSON());
  const p1 = db.ePosgreSQL() ? '$1' : '?';
  const quantidade = db.ePosgreSQL() ?
      `COUNT(l.idLivro)::integer as "quantidadeLivros"`
    : `COUNT(l.idLivro) as "quantidadeLivros"`;
  const dadosLivro = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.DataRenovacom as "dataRenovacom", ${quantidade}
      FROM Biblioteca b
      LEFT JOIN Livro l on l.fkBiblioteca = b.idBiblioteca
      WHERE b.fkUsuario = ${p1}
      GROUP BY b.idBiblioteca, b.Nome, b.DataRenovacom
      ORDER BY lower(b.Nome) ASC;`,
      [idUsuario]
  );
  
  const rows = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${rows.length} elementos obtidos`);
  const data = rows.map(row => new Biblioteca.BibliotecaCosLivros(row));

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function postBiblioteca(idUsuario, biblioteca){
  console.log('💬 Petiçom de postBiblioteca ' + biblioteca.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const c = { indice: 0 };
  const queryInsert = `INSERT INTO Biblioteca
    (fkUsuario, Nome, Endereco, Localidade, Telefone, DataAsociamento, DataRenovacom, Comentario)
    VALUES (${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)},
            ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}) 
    ${db.ePosgreSQL() ? 'RETURNING idbiblioteca' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('biblioteca', 'idbiblioteca'), 
          (SELECT COALESCE(MAX(idbiblioteca), 0) + 1 FROM biblioteca), 
          false
      );
 */

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

  const resultado = await db.query(queryInsert, dadosInsert);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idbiblioteca;
    }
  } else {
    idResult = resultado.insertId || (resultado[0] && resultado[0].insertId);
  }

  console.log(`✅ id: ${idResult} biblioteca creada`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putBiblioteca(idUsuario, biblioteca){
  console.log('💬 Petiçom de putBiblioteca ' + biblioteca.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  const queryUpdate = `UPDATE Biblioteca SET
      Nome = ${db.qId(c)},
      Endereco = ${db.qId(c)},
      Localidade = ${db.qId(c)},
      Telefone = ${db.qId(c)},
      DataAsociamento = ${db.qId(c)},
      DataRenovacom = ${db.qId(c)},
      Comentario = ${db.qId(c)}
    WHERE idBiblioteca = ${db.qId(c)} AND fkUsuario = ${db.qId(c)}
    ${db.ePosgreSQL() ? 'RETURNING idbiblioteca;' : ';'}`;

  const dadosUpdate = [
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

  const resultado = await db.query(queryUpdate, dadosUpdate);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idbiblioteca;
    }
  } else {
    idResult = resultado.updatedId || (resultado[0] && resultado[0].updatedId);
  }
  
  console.log(`✅ id: ${idResult} biblioteca actualizada`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarBiblioteca(idUsuario, id) {
  console.log(`💬 id pra borrar: ${id}`);
  let idResult = 0;
  const c = { indice: 0 };

  const resultado = await db.query(
    `DELETE FROM Biblioteca WHERE idBiblioteca = ${db.qId(c)} AND fkUsuario = ${db.qId(c)};`,
    [id, idUsuario]
  );

  const filasBorradas = db.ePosgreSQL() 
    ? resultado.rowCount
    : (resultado.affectedRows || (resultado && resultado.affectedRows));

  if (filasBorradas === 1) {
    idResult = id;
  }

  console.log(`✅ id: ${idResult} biblioteca borrada 🔴`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

export default {
  getBibliotecas, getBibliotecasCosLivros, getBiblioteca, getBibliotecaPorNome, postBiblioteca, putBiblioteca, borrarBiblioteca
}
