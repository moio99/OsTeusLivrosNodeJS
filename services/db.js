const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  /*
  var conPool = mysql.createPool(config.db);                    // em vez do anterior para enviar o Error: Too many connections.
  const connection = await conPool.getConnection();             // em vez do anterior para enviar o Error: Too many connections.
 */
  const [results, ] = await connection.execute(sql, params);
  connection.end();
  return results;
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