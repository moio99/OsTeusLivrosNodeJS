import db from '../utils/db.js';
import helper from '../utils/helper.js';

async function getEditoriais(idUsuario){
  console.log('💬 Petiçom de getEditoriais ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web  
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario}   
      ORDER BY lower(e.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function getEditorial(idUsuario, id){
  console.log('💬 Petiçom de getEditorial ' + new Date().toJSON());
  const dadosEditorial = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.Direicom as direicom, e.web, e.Comentario as comentario  
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario} AND e.idEditorial = ${id} ;`
  );
  
  const editorial = helper.emptyOrRows(dadosEditorial);

  if (editorial.length == 0) {
    return {
      data: [],
      meta: {'id': id}
    }
  }

  console.log(`✅ ${editorial.length} elementos obtidos`);
  return {
    data: editorial,
    meta: {'id': id}
  }
}

// Para evitar ter na BD dous co mesmo nome.
async function getEditorialPorNome(idUsuario, nome){
  console.log('💬 Petiçom de getEditorialPorNome ' + idUsuario, nome);
  console.log('💬 Petiçom de getEditorialPorNome ' + new Date().toJSON());
  const dadosEditorial = await db.query(
    `SELECT e.idEditorial as id
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario} AND e.Nome like '%${nome}%' ;`
  );
  
  const editorial = helper.emptyOrRows(dadosEditorial);
  console.log(`✅ ${editorial.length} elementos obtidos`);

  const meta = {'id': editorial.length > 0 ? editorial[0].id : 0, 'quantidade': editorial.length};

  return {
    data: editorial,
    meta
  }
}

async function getEditoriaisCosLivros(idUsuario){
  console.log('💬 Petiçom de getEditoriaisCosLivros ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT e.idEditorial as id, e.Nome as nome, e.web, COUNT(l.idLivro) as "quantidadeLivros" 
      FROM Editorial e
      LEFT JOIN Livro l on l.fkEditorial = e.idEditorial
      WHERE e.fkUsuario = ${idUsuario}
      GROUP BY e.idEditorial
      ORDER BY lower(e.Nome) ASC;`
  );
  
  const data = helper.emptyOrRows(dadosLivro);
  console.log(`✅ ${data.length} elementos obtidos`);

  const meta = {'info': 'nada'};

  return {
    data,
    meta
  }
}

async function postEditorial(idUsuario, editorial){
  console.log('💬 Petiçom de postEditorial ' + editorial.nome + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const c = { indice: 0 };
  const queryInsert = `INSERT INTO Editorial
    (fkUsuario, Nome, Direicom, web, Comentario)
    VALUES (${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}, ${db.qId(c)}) 
    ${db.ePosgreSQL() ? 'RETURNING ideditorial' : ''}`;

/**
 * posgreSQL
 * Para que o índice de idusuario tenha o último valor logo da carrega maxiva ejecutar o seguinte 
 * Erro no log:  duplicate key value violates unique constraint "usuario_pkey"
 * 
      SELECT setval(
          pg_get_serial_sequence('editorial', 'ideditorial'), 
          (SELECT COALESCE(MAX(ideditorial), 0) + 1 FROM editorial), 
          false
      );
 */

  const dadosInsert = [
    idUsuario,
    editorial.nome,
    editorial.direicom,
    editorial.web,
    editorial.comentario
  ];

  const resultado = await db.query(queryInsert, dadosInsert);
  if (db.ePosgreSQL()) {
    if (resultado && resultado.length > 0) {
      idResult = resultado[0].ideditorial;
    }
  } else {
    idResult = resultado.insertId || (resultado[0] && resultado[0].insertId);
  }
  
  console.log('✅ id: ' + idResult + ' editorial creada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function putEditorial(idUsuario, editorial){
  console.log('💬 Petiçom de putEditorial ' + editorial.id + ' data: ' + new Date().toJSON());
  let idResult = 0;

  const c = { indice: 0 };
  const queryUpdate = `UPDATE Editorial SET
      Nome =  ${db.qId(c)},
      Direicom =  ${db.qId(c)},
      web =  ${db.qId(c)},
      Comentario =  ${db.qId(c)}
    WHERE idEditorial =  ${db.qId(c)} AND fkUsuario =  ${db.qId(c)};`;
  const dadosUpdate = [
    db.stringOuNullSimple(editorial.nome),
    db.stringOuNullSimple(editorial.direicom),
    db.stringOuNullSimple(editorial.web),
    db.stringOuNullSimple(editorial.comentario),
    editorial.id,
    idUsuario
  ];
  await db.query(queryUpdate, dadosUpdate).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1 && ResultSetHeader.changedRows == 1)
        idResult = editorial.id;
    }
  );
  
  console.log('✅ id: ' + idResult + ' editorial actualizada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

async function borrarEditorial(idUsuario, id) {
  console.log(`💬 id pra borrar: ${id}`);
  let idResult = 0;
  await db.query(
    `DELETE FROM Editorial WHERE idEditorial = ${id} AND fkUsuario = ${idUsuario};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('✅ id: ' + idResult + ' editorial borrada');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

export default {
  getEditoriais, getEditoriaisCosLivros, getEditorial, getEditorialPorNome, postEditorial, putEditorial, borrarEditorial
}
