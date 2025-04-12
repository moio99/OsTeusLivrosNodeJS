const db = require('../utils/db');
const helper = require('../utils/helper');

async function getEstilosLiterarios(idUsuario){
  console.log('Petiçom de getEstilosLiterarios ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEstilo as id, e.Nome as nome
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario}   
      ORDER BY lower(e.Nome) ASC;`
  );
  
  const estilosLiterarios = helper.emptyOrRows(dadosLivro);
  console.log(estilosLiterarios.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    estilosLiterarios,
    meta
  }
}

async function getEstiloLiterario(idUsuario, id){
  console.log('Petiçom de getEstiloLiterario ' + new Date().toJSON());
  const dadosEstiloLiterario = await db.query(
    `SELECT e.idEstilo as id, e.Nome as nome, e.Comentario as comentario
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario} AND e.idEstilo = ${id} ;`
  );
  
  const estiloLiterario = helper.emptyOrRows(dadosEstiloLiterario);
  console.log(estiloLiterario.length + ' elementos devoltos');

  const meta = {'id': id};

  return {
    estiloLiterario,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getEstiloLiterarioPorNome(idUsuario, nome){
  console.log('Petiçom de getEstiloLiterarioPorNome ' + new Date().toJSON());
  const dadosEstiloLiterario = await db.query(
    `SELECT e.idEstilo as id
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario} AND e.Nome like '%${nome}%' ;`
  );
  
  const estiloLiterario = helper.emptyOrRows(dadosEstiloLiterario);
  console.log(estiloLiterario.length + ' elementos devoltos');

  const meta = {'id': estiloLiterario.length > 0 ? estiloLiterario[0].id : 0, 'quantidade': estiloLiterario.length};

  return {
    estiloLiterario,
    meta
  }
}

async function getEstilosLiterariosCosLivros(idUsuario){
  console.log('Petiçom de getEstilosLiterariosCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEstilo as id, e.Nome as nome, COUNT(l.idLivro) as quantidadeLivros, CONVERT(SUM(l.Lido), UNSIGNED) as quantidadeLidos
      FROM EstiloLiterario e
      LEFT JOIN Livro l on l.fkEstilo = e.idEstilo
      WHERE e.fkUsuario = ${idUsuario}
      GROUP BY e.idEstilo
      ORDER BY e.idEstilo ASC;`
  );

  const estilosLiterarios = helper.emptyOrRows(dadosLivro);
  console.log(estilosLiterarios.length + ' elementos devoltos');

  const meta = {'nada': 'nada'};

  return {
    estilosLiterarios,
    meta
  }
}

async function postEstiloLiterario(idUsuario, EstiloLiterario){
  console.log('Petiçom de postEstiloLiterario ' + EstiloLiterario.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `INSERT INTO EstiloLiterario
    (fkUsuario, Nome, Comentario)
  VALUES (?, ?, ?)`;

  const dadosInsert = [
    idUsuario,
    EstiloLiterario.nome,
    db.stringOuNullSimple(EstiloLiterario.comentario),
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );
  
  console.log('id: ' + idResult + ' EstiloLiterario creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putEstiloLiterario(idUsuario, EstiloLiterario){
  console.log('Petiçom de putEstiloLiterario ' + EstiloLiterario.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `UPDATE EstiloLiterario SET
      Nome = ?,
      Comentario = ?
    WHERE idEstilo = ? AND fkUsuario = ?`;

  const dadosInsert = [
    db.stringOuNullSimple(EstiloLiterario.nome),
    db.stringOuNullSimple(EstiloLiterario.comentario),    
    EstiloLiterario.id,
    idUsuario
  ];
  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = EstiloLiterario.id;
    }
  );
  
  console.log('id: ' + idResult + ' EstiloLiterario actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarEstiloLiterario(idUsuario, id) {
  console.log('id pra borrar: ' + id);
  let idResult = 0;
  await db.query(
    `DELETE FROM EstiloLiterario WHERE idEstilo = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' EstiloLiterario borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getEstilosLiterarios, getEstilosLiterariosCosLivros, getEstiloLiterario, getEstiloLiterarioPorNome, postEstiloLiterario, putEstiloLiterario, borrarEstiloLiterario
}