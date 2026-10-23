import db from '../utils/db.js';
import helper from '../utils/helper.js';

async function getEstilosLiterarios(idUsuario){
  console.log('💬 Petiçom de getEstilosLiterarios ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEstilo as id, e.Nome as "nome"
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario}   
      ORDER BY lower(e.nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function getEstilosLiterario(idUsuario, id){
  console.log('💬 Petiçom de getEstiloLiterario ' + new Date().toJSON());
  const dadosEstiloLiterario = await db.query(
    `SELECT e.idEstilo as id, e.Nome as nome, e.Comentario as comentario
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario} AND e.idEstilo = ${id} ;`
  );
  
  const estiloLiterario = helper.emptyOrRows(dadosEstiloLiterario);
  console.log(`✅ ${estiloLiterario.length} elementos obtidos`);

  const meta = {'id': id};

  return {
    data: estiloLiterario,
    meta
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getEstiloLiterarioPorNome(idUsuario, nome){
  console.log('💬 Petiçom de getEstiloLiterarioPorNome ' + new Date().toJSON());
  const dadosEstiloLiterario = await db.query(
    `SELECT e.idEstilo as id
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario} AND e.Nome like '%${nome}%' ;`
  );
  
  const estiloLiterario = helper.emptyOrRows(dadosEstiloLiterario);
  console.log(`✅ ${estiloLiterario.length} elementos obtidos`);

  const meta = {'id': estiloLiterario.length > 0 ? estiloLiterario[0].id : 0, 'quantidade': estiloLiterario.length};

  return {
    data: estiloLiterario,
    meta
  }
}

async function getEstilosLiterariosCosLivros(idUsuario){
  console.log('💬 Petiçom de getEstilosLiterariosCosLivros ' + new Date().toJSON());
  const p1 = db.ePosgreSQL() ? '$1' : '?';
  const quantidade = db.ePosgreSQL() ?
      `SUM(CASE WHEN l.Lido THEN 1 ELSE 0 END)::integer as "quantidadeLidos", COUNT(l.idLivro)::integer as "quantidadeLivros"`
    : 'SUM(l.Lido) as "quantidadeLidos", COUNT(l.idLivro) as "quantidadeLivros"';
  const dadosLivro = await db.query(
    `SELECT e.idEstilo as id, e.Nome as nome, ${quantidade} 
      FROM EstiloLiterario e
      LEFT JOIN Livro l on l.fkEstilo = e.idEstilo
      WHERE e.fkUsuario = ${p1}
      GROUP BY e.idEstilo, e.Nome
      ORDER BY e.idEstilo ASC;`,
    [idUsuario]
  );

  const data = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function postEstiloLiterario(idUsuario, EstiloLiterario){
  console.log('💬 Petiçom de postEstiloLiterario ' + EstiloLiterario.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const c = { indice: 0 };
  const queryInsert = `INSERT INTO EstiloLiterario
    (fkUsuario, Nome, Comentario)
    VALUES (${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)})
    ${db.ePosgreSQL() ? 'RETURNING idestilo' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('EstiloLiterario', 'idestilo'), 
          (SELECT COALESCE(MAX(idestilo), 0) + 1 FROM EstiloLiterario), 
          false
      );
 */

  const dadosInsert = [
    idUsuario,
    EstiloLiterario.nome,
    db.stringOuNullSimple(EstiloLiterario.comentario),
  ];

  const resultado = await db.query(queryInsert, dadosInsert);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].idestilo;
    }
  } else {
    idResult = resultado.insertId || (resultado[0] && resultado[0].insertId);
  }
  
  console.log('✅ id: ' + idResult + ' EstiloLiterario creado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putEstiloLiterario(idUsuario, EstiloLiterario){
  console.log('💬 Petiçom de putEstiloLiterario ' + EstiloLiterario.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const c = { indice: 0 };
  const queryUpdate = `UPDATE EstiloLiterario SET
      Nome = ${db.qId(c)},
      Comentario = ${db.qId(c)}
    WHERE idEstilo = ${db.qId(c)} AND fkUsuario = ${db.qId(c)}`;

  const dadosUpdate = [
    db.stringOuNullSimple(EstiloLiterario.nome),
    db.stringOuNullSimple(EstiloLiterario.comentario),    
    EstiloLiterario.id,
    idUsuario
  ];
  await db.query(queryUpdate, dadosUpdate).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = EstiloLiterario.id;
    }
  );
  
  console.log('✅ id: ' + idResult + ' EstiloLiterario actualizado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarEstiloLiterario(idUsuario, id) {
  console.log(`💬 id pra borrar: ${id}`);
  let idResult = 0;
  await db.query(
    `DELETE FROM EstiloLiterario WHERE idEstilo = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('✅ id: ' + idResult + ' EstiloLiterario borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

export default {
  getEstilosLiterarios, getEstilosLiterariosCosLivros, getEstilosLiterario, getEstiloLiterarioPorNome, postEstiloLiterario, putEstiloLiterario, borrarEstiloLiterario
}