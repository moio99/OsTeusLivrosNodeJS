const mysql = require('mysql2/promise');
const { configLocal, configRailway, configRender } = require('./config');
const { Pool } = require('pg');

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

const pool = new Pool(configRender);

async function query(sql, params, isMigracom = false) {
  let connection;
  let rows;
  try {
    if (!isMigracom && process.env.QUAL_PROJECTO === 'render') {
      console.log('Qual projecto: render');
      const salPosgreSQL = sql
        .replaceAll('CONVERT(SUM', 'CAST(SUM')
        .replaceAll(', UNSIGNED', ' AS INTEGER')
        .replaceAll('YEAR(', 'EXTRACT(YEAR FROM ')
        .replaceAll('DATE_FORMAT(', 'TO_CHAR(')
        .replaceAll(`,'%d/%m/%Y')`, `, 'DD/MM/YYYY')`);
      const resultado = await pool.query(salPosgreSQL);
      return resultado.rows;
    } else {
      if (process.env.NODE_ENTORNO === 'local') {
        connection = await mysql.createConnection(configLocal.db);
      } else {
        connection = await mysql.createConnection(configRailway);
      }
      [rows] = await connection.execute(sql, params);
    }
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
  query, stringOuNull, stringOuNullSimple, numberOuNull, numberOu0, pool
}