const mysql = require('mysql2/promise');
const { configLocal, configRailway } = require('./config');

// async function query(sql, params) {
//   const connection = await mysql.createConnection(configLocal.db);
//   /*
//   var conPool = mysql.createPool(configLocal.db);               // em vez do anterior para enviar o Error: Too many connections.
//   const connection = await conPool.getConnection();             // em vez do anterior para enviar o Error: Too many connections.
//  */
//   const [results, ] = await connection.execute(sql, params);
//   connection.end();
//   return results;
// }

async function query(sql, params) {
  console.log('sql');
  let connection;
  try {
    if (process.env.NODE_ENTORNO === 'local') {
      console.log('process.env.NODE_ENTORNOlocal: ' + process.env.NODE_ENTORNO);
      connection = await mysql.createConnection(configLocal.db);
    } else {
      console.log('process.env.NODE_ENTORNO: ' + process.env.NODE_ENTORNO);
      connection = await mysql.createConnection(configRailway);
    }
    const [rows] = await connection.execute(sql, params);

    return rows;
  } catch (err) {
    console.error('Erro ao realiçar o GET:', err);
  } finally {
    // Fecha a conexom
    if (connection) {
      await connection.end();
    }
  }
  return 0;
}

function stringOuNull(value) {
  if (value == null || value == '')
    return null;
  else 
    return `'${value}'`;
}

function stringOuNullSimple(value) {
  if (value == null || value == '')
    return null;
  else 
    return `${value}`;
}

function numberOuNull(value) {
  if (value == null || value == 0)
    return null;
  else 
    return value;
}

function numberOu0(value) {
  if (value == null)
    return 0;
  else 
    return value;
}

module.exports = {
  query, stringOuNull, stringOuNullSimple, numberOuNull, numberOu0
}