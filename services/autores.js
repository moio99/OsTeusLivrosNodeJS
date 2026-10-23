import db from '../utils/db.js';
import helper from '../utils/helper.js';
import livro from './livros.js';

async function getAutores(idUsuario){
  console.log('💬 Petiçom de getAutores ' + new Date().toJSON());
  const quantidade = db.ePosgreSQL() ?
      `SUM(CASE WHEN l.Lido THEN 1 ELSE 0 END)::integer as "quantidadeLidos"`
    : 'CONVERT(SUM(l.Lido), UNSIGNED) as quantidadeLidos';
  const dadosAutores = await db.query(
    `SELECT a.idAutor as id, a.Nome as nome, COUNT(l.idLivro) as "quantidadeLivros", ${quantidade}
      FROM Autor a
      LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
      LEFT JOIN Livro l ON ars.fkLivro = l.idLivro
      WHERE a.fkUsuario = ${idUsuario}
      GROUP BY a.idAutor
      ORDER BY lower(a.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getAutorPorNome(idUsuario, nome){
  console.log('💬 Petiçom de getAutorPorNome ' + new Date().toJSON());
  const dadosAutor = await db.query(
    `SELECT a.idAutor as id
      FROM Autor a
      WHERE a.fkUsuario = ${idUsuario} AND a.Nome like '%${nome}%' ;`
  );
  
  const autor = helper.emptyOrRows(dadosAutor);
  console.log(`✅ ${autor.length} elementos obtidos`);

  const meta = {'id': autor.length > 0 ? autor[0].id : 0, 'quantidade': autor.length};

  return {
    data: autor,
    meta
  }
}

async function getAutoresFiltrados(idUsuario, id, tipo){
  console.log('💬 Petiçom de getAutoresFiltrados id: ' + id + ' tipo: ' + tipo + ' tempo: ' + new Date().toJSON());
  const quantidade = db.ePosgreSQL() ?
      `SUM(CASE WHEN l.Lido THEN 1 ELSE 0 END)::integer as "quantidadeLidos", COUNT(l.idLivro)::integer as "quantidadeLivros"`
    : 'SUM(l.Lido) as quantidadeLidos, COUNT(l.idLivro) as quantidadeLivros';
  const queryA = `SELECT a.idAutor as id, a.Nome as nome, ${quantidade} 
    FROM Autor a
    LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
    LEFT JOIN Livro l ON ars.fkLivro = l.idLivro`;
  let queryB = ` WHERE a.fkUsuario = ${idUsuario}`;
  const queryC = ` GROUP BY a.idAutor, a.Nome
    ORDER BY lower(a.Nome) ASC;`;

  if (tipo == 1) 
    queryB += ' AND a.fkNacionalidade = ' + id;
  else
    queryB += ' AND a.fkPais = ' + id;
  const dadosAutores = await db.query(
    queryA + queryB + queryC
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutoresPorNacons(idUsuario){
  console.log('💬 Petiçom de getAutoresPorNacions ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT n.idNacionalidade as id, n.Nome as nome, COUNT(a.idAutor) as "quantidadeAutores"
      FROM Autor a
      LEFT JOIN Nacionalidade n ON a.fkNacionalidade = n.idNacionalidade
      WHERE a.fkNacionalidade IS NOT NULL AND a.fkUsuario = ${idUsuario}
      GROUP BY n.idNacionalidade, n.Nome
      ORDER BY COUNT(a.idAutor) DESC, lower(n.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutoresPorPaises(idUsuario){
  console.log('💬 Petiçom de getAutoresPorPaises ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT p.idPais as id, p.Nome as nome, COUNT(a.idAutor) as "quantidadeAutores"
      FROM Autor a
      LEFT JOIN Pais p ON a.fkPais = p.idPais
      WHERE a.fkPais IS NOT NULL AND a.fkUsuario = ${idUsuario}
      GROUP BY p.idPais, p.Nome
      ORDER BY COUNT(a.idAutor) DESC, p.Nome ASC;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutor(idUsuario, id){
  console.log('💬 Petiçom de getAutor id: ' + id + ' tempo ' + new Date().toJSON());
  const dataSelect = db.ePosgreSQL() ?
      `, TO_CHAR(a.DataNacemento, 'DD/MM/YYYY') as "dataNacemento"
       , TO_CHAR(a.DataDefuncom, 'DD/MM/YYYY') as "dataDefuncom", a.Premios as "premios", a.web`
    : `, DATE_FORMAT(a.DataNacemento,'%d/%m/%Y') as "dataNacemento"
       , DATE_FORMAT(a.DataDefuncom,'%d/%m/%Y') as "dataDefuncom", a.Premios as "premios", a.web`;
  const dadosAutor = await db.query(
    `SELECT a.idAutor as id, a.Nome as "nome", a.NomeReal as "nomeReal", a.LugarNacemento as "lugarNacemento"
      ${dataSelect}
      , a.Comentario as "comentario"
      , n.idNacionalidade, n.Nome as "nomeNacionalidade"
      , p.idPais, p.Nome as "nomePais"
      , COUNT(l.idLivro) as "quantidade"
      FROM Autor a
      LEFT JOIN Nacionalidade n ON a.fkNacionalidade = n.idNacionalidade
      LEFT JOIN Pais p ON a.fkPais = p.idPais
      LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
      LEFT JOIN Livro l ON ars.fkLivro = l.idLivro
      WHERE a.fkUsuario = ${idUsuario} AND a.idAutor = ${id}
      GROUP BY a.idAutor, n.idNacionalidade, p.idPais;`
  );
  
  const autor = helper.emptyOrRows(dadosAutor);
  console.log(`✅ ${autor.length} elementos obtidos`);

  const meta = {'id': id, 'quantidade': autor.length};

  return {
    data: autor,
    meta
  }
}

async function postAutor(idUsuario, autor){
  console.log('💬 Petiçom de postAutor ' + autor.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  const queryInsert = `INSERT INTO Autor
    (fkUsuario, Nome, NomeReal, LugarNacemento, DataNacemento, dataDefuncom, Premios, web, Comentario
      , fkNacionalidade, fkPais)
    VALUES
      (${idUsuario}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)},
                     ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)})
    ${db.ePosgreSQL() ? 'RETURNING idautor' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('Autor', 'idautor'), 
          (SELECT COALESCE(MAX(idautor), 0) + 1 FROM Autor), 
          false
      );

      SELECT setval(
          pg_get_serial_sequence('Autores', 'idautores'), 
          (SELECT COALESCE(MAX(idautores), 0) + 1 FROM Autores), 
          false
      );

      SELECT setval(
          pg_get_serial_sequence('Generos', 'idgeneros'), 
          (SELECT COALESCE(MAX(idgeneros), 0) + 1 FROM Generos), 
          false
      );
 */

  const dadosInsert = [
    autor.nome,
    db.stringOuNullSimple(autor.nomeReal),
    db.stringOuNullSimple(autor.lugarNacemento),
    db.stringOuNullSimple(autor.dataNacemento),
    db.stringOuNullSimple(autor.dataDefuncom),
    db.stringOuNullSimple(autor.premios),
    db.stringOuNullSimple(autor.web),
    db.stringOuNullSimple(autor.comentario),
    db.numberOuNull(autor.idNacionalidade),
    db.numberOuNull(autor.idPais)
  ];

  const resultado = await db.query(queryInsert, dadosInsert);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idautor;
    }
  } else {
    idResult = resultado.insertId || (resultado[0] && resultado[0].insertId);
  }
  
  console.log(`✅ id: ${idResult} autor creado`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putAutor(idUsuario, autor){
  console.log('💬 Petiçom de putAutor ' + autor.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  const queryUpdate = `UPDATE Autor SET
      Nome = ${db.qId(c)}, NomeReal = ${db.qId(c)}, 
      LugarNacemento = ${db.qId(c)}, 
      DataNacemento = ${db.qId(c)}, DataDefuncom = ${db.qId(c)}, 
      Premios = ${db.qId(c)}, Web = ${db.qId(c)}, Comentario = ${db.qId(c)}, 
      fkNacionalidade = ${db.qId(c)}, fkPais = ${db.qId(c)}
    WHERE idAutor = ${db.qId(c)} AND fkUsuario = ${db.qId(c)}
    ${db.ePosgreSQL() ? 'RETURNING idautor;' : ';'}`;

  const dadosUpdate = [
    autor.nome,
    db.stringOuNullSimple(autor.nomeReal),
    db.stringOuNullSimple(autor.lugarNacemento),
    db.stringOuNullSimple(autor.dataNacemento),
    db.stringOuNullSimple(autor.dataDefuncom),
    db.stringOuNullSimple(autor.premios),
    db.stringOuNullSimple(autor.web),
    db.stringOuNullSimple(autor.comentario),
    db.numberOuNull(autor.idNacionalidade),
    db.numberOuNull(autor.idPais),
    autor.id,
    idUsuario
  ];

  const resultado = await db.query(queryUpdate, dadosUpdate);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idautor;
    }
  } else {
    idResult = resultado.updatedId || (resultado[0] && resultado[0].updatedId);
  }
  
  console.log(`✅ id: ${idResult} autor actualizado`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarAutor(idUsuario, id) {
  console.log(`💬 id pra borrar: ${id}`);
  let idResult = 0;
  const c = { indice: 0 };

  let dados = livro.getLivrosPorAutor(id);
  if (dados.quantidade > 0) {
    const meta = {'livrosAutor': dados};
    return {
      idResult,
      meta
    }
  }
  else {
    const resultado = await db.query(
      `DELETE FROM Autor WHERE idAutor = ${db.qId(c)} AND fkUsuario = ${db.qId(c)};`,
      [id, idUsuario]
    );

    const filasBorradas = db.ePosgreSQL() 
      ? resultado.rowCount
      : (resultado.affectedRows || (resultado && resultado.affectedRows));

    if (filasBorradas === 1) {
      idResult = id;
    }
  }

  console.log(`✅ id: ${idResult} autor borrado 🔴`);
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

export default {
  getAutores, getAutorPorNome, getAutoresFiltrados, getAutoresPorNacons, getAutoresPorPaises, getAutor
  , postAutor, putAutor, borrarAutor
}
