const mysql = require('mysql2/promise');
const { configLocal, configRailway, configRender, configSupabase } = require('./config');
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

const pool = new Pool(process.env.QUAL_SQL === 'PosgreSQLrender' ? configRender : configSupabase);

async function query(sql, params, isMigracom = false) {
  let connection;
  let pgClient;
  let dados;
  try {
    if (!isMigracom && process.env.QUAL_SQL.length > 8 && process.env.QUAL_SQL.substring(0, 9) === 'PosgreSQL') {
      pgClient = await pool.connect();
      const salPosgreSQL = sql
        .replaceAll('CONVERT(SUM', 'CAST(SUM')
        .replaceAll(', UNSIGNED', ' AS INTEGER')
        .replaceAll('YEAR(', 'EXTRACT(YEAR FROM ')
        .replaceAll('DATE_FORMAT(', 'TO_CHAR(')
        .replaceAll(`,'%d/%m/%Y')`, `, 'DD/MM/YYYY')`);
      const resultado = await pgClient.query(salPosgreSQL, params);
      return resultado.rows;
    } else {
      if (process.env.NODE_ENTORNO === 'local') {
        connection = await mysql.createConnection(configLocal.db);
      } else {
        connection = await mysql.createConnection(configRailway);
      }
      dados = await connection.execute(sql, params);
      if (dados && dados[0])
        return dados[0];
    }
  } catch (err) {
    console.error('Erro ao realiçar o GET:', err);
  } finally {
    // Fecha a conexom
    if (connection) {
      await connection.end();
    }
    if (pgClient) {
      pgClient.release();
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