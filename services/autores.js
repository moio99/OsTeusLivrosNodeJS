const db = require('../utils/db');
const helper = require('../utils/helper');
const livro = require('./livros');

async function getAutores(idUsuario){
  console.log('Petiçom de getAutores ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT a.idAutor as id, a.Nome as nome, COUNT(l.idLivro) as quantidadeLivros, CONVERT(SUM(l.Lido), UNSIGNED) as quantidadeLidos
      FROM Autor a
      LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
      LEFT JOIN Livro l ON ars.fkLivro = l.idLivro
      WHERE a.fkUsuario = ${idUsuario}
      GROUP BY a.idAutor
      ORDER BY lower(a.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(data.length + ' elementos devoltos');

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getAutorPorNome(idUsuario, nome){
  console.log('Petiçom de getAutorPorNome ' + new Date().toJSON());
  const dadosAutor = await db.query(
    `SELECT a.idAutor as id
      FROM Autor a
      WHERE a.fkUsuario = ${idUsuario} AND a.Nome like '%${nome}%' ;`
  );
  
  const autor = helper.emptyOrRows(dadosAutor);
  console.log(autor.length + ' elementos devoltos');

  const meta = {'id': autor.length > 0 ? autor[0].id : 0, 'quantidade': autor.length};

  return {
    autor,
    meta
  }
}

async function getAutoresFiltrados(idUsuario, id, tipo){
  console.log('Petiçom de getAutoresFiltrados id: ' + id + ' tipo: ' + tipo + ' tempo: ' + new Date().toJSON());
  const queryA = `SELECT a.idAutor as id, a.Nome as nome, COUNT(l.idLivro) as quantidadeLivros, SUM(l.Lido) as quantidadeLidos
    FROM Autor a
    LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
    LEFT JOIN Livro l ON ars.fkLivro = l.idLivro`;
  let queryB = ` WHERE a.fkUsuario = ${idUsuario}`;
  const queryC = ` GROUP BY a.idAutor
    ORDER BY lower(a.Nome) ASC;`;

  if (tipo == 1) 
    queryB += ' AND a.fkNacionalidade = ' + id;
  else
    queryB += ' AND a.fkPais = ' + id;
  const dadosAutores = await db.query(
    queryA + queryB + queryC
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(data.length + ' elementos devoltos');

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutoresPorNacons(idUsuario){
  console.log('Petiçom de getAutoresPorNacions ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT n.idNacionalidade as id, n.Nome as nome, COUNT(a.idAutor) as quantidadeAutores
      FROM Autor a
      LEFT JOIN Nacionalidade n ON a.fkNacionalidade = n.idNacionalidade
      WHERE a.fkUsuario = ${idUsuario}
      GROUP BY n.idNacionalidade
      ORDER BY COUNT(a.idAutor) DESC, lower(a.Nome) ASC;;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(data.length + ' elementos devoltos');

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutoresPorPaises(idUsuario){
  console.log('Petiçom de getAutoresPorPaises ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT p.idPais as id, p.Nome as nome, COUNT(a.idAutor) as quantidadeAutores
      FROM Autor a
      LEFT JOIN Pais p ON a.fkPais = p.idPais
      WHERE a.fkUsuario = ${idUsuario}
      GROUP BY p.idPais
      ORDER BY COUNT(a.idAutor) DESC, p.Nome ASC;`
  );
  
  const data = helper.emptyOrRows(dadosAutores);
  console.log(data.length + ' elementos devoltos');

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getAutor(idUsuario, id){
  console.log('Petiçom de getAutor id: ' + id + ' tempo ' + new Date().toJSON());
  const dadosAutor = await db.query(
    `SELECT a.idAutor as id, a.Nome as nome, a.NomeReal as nomeReal, a.LugarNacemento as lugarNacemento
      , DATE_FORMAT(a.DataNacemento,'%d/%m/%Y') as dataNacemento
      , DATE_FORMAT(a.DataDefuncom,'%d/%m/%Y') as dataDefuncom, a.Premios as premios, a.web
      , a.Comentario as comentario
      , n.idNacionalidade, n.Nome as nomeNacionalidade
      , p.idPais, p.Nome as nomePais
      , COUNT(l.idLivro) as quantidade
      FROM Autor a
      LEFT JOIN Nacionalidade n ON a.fkNacionalidade = n.idNacionalidade
      LEFT JOIN Pais p ON a.fkPais = p.idPais
      LEFT JOIN Autores ars ON a.idAutor = ars.fkAutor
      LEFT JOIN Livro l ON ars.fkLivro = l.idLivro
      WHERE a.fkUsuario = ${idUsuario} AND a.idAutor = ${id}
      GROUP BY a.idAutor;`
  );
  
  const autor = helper.emptyOrRows(dadosAutor);
  console.log(autor.length + ' elementos devoltos');
  console.log(autor);

  const meta = {'id': id, 'quantidade': autor.length};

  return {
    autor,
    meta
  }
}

async function postAutor(idUsuario, autor){
  console.log('Petiçom de postAutor ' + autor.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `INSERT INTO Autor
    (fkUsuario, Nome, NomeReal, LugarNacemento, DataNacemento, dataDefuncom, Premios, web, Comentario
      , fkNacionalidade, fkPais)
    VALUES
      (${idUsuario}, ?, ?, ?, ?, ?, ?, ?, ?
      , ?, ?);`;

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

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' autor creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putAutor(idUsuario, autor){
  console.log('Petiçom de putAutor ' + autor.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const queryInsert = `UPDATE Autor SET
      Nome = ?, NomeReal = ?, LugarNacemento = ?, DataNacemento = ?, DataDefuncom = ?, Premios = ?
    , Web = ?, Comentario = ?, fkNacionalidade = ?, fkPais = ?
    WHERE idAutor = ? AND fkUsuario = ?;`;

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
    db.numberOuNull(autor.idPais),
    autor.id,
    idUsuario
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = autor.id;
    }
  );
  
  console.log('id: ' + idResult + ' autor actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarAutor(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;

  let dados = livro.getLivrosPorAutor(id);
  if (dados.quantidade > 0) {
    const meta = {'livrosAutor': dados};
    return {
      idResult,
      meta
    }
  }
  else {
    await db.query(
      `DELETE FROM Autor WHERE idAutor = ${id} AND fkUsuario = ${idUsuario};`
    ).then(ResultSetHeader => {
        if (ResultSetHeader.affectedRows == 1)
          idResult = id;
      }
    );
  }

  console.log('id: ' + idResult + ' autor borrado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getAutores, getAutorPorNome, getAutoresFiltrados, getAutoresPorNacons, getAutoresPorPaises, getAutor
  , postAutor, putAutor, borrarAutor
}
