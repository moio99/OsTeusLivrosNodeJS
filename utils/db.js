import mysql from 'mysql2/promise';
import config from './config.js';
import { Pool } from 'pg';

const { configRailway, configRender, configSupabase } = config;
let configuracomLocal = null;

if (process.env.NODE_ENTORNO === 'local') {
  try {
    // IMPORT DINÁMICO: Cárregase em tempo de ejecuçom e nom dá erro ao arrincar en PRO
    const configLocal = await import('./config-local.js');
    configuracomLocal = configLocal.default.configLocal; 
  } catch (error) {
    console.log('⚠️ Nom se puido carregar config-local.js, usaram-se variaveis de contorna.');
  }
}

// async function query(sql, params) {
//   const connection = await mysql.createConnection(configuracomLocal.db);
//   /*
//   var conPool = mysql.createPool(configuracomLocal.db);               // em vez do anterior para enviar o Error: Too many connections.
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
    if (!isMigracom && ePosgreSQL()) {
      pgClient = await pool.connect();
      const salPosgreSQL = sql
        .replaceAll('YEAR(', 'EXTRACT(YEAR FROM ');
      const resultado = await pgClient.query(salPosgreSQL, params);
      console.log(`💿 posgreSQL ${process.env.QUAL_SQL}`);
      return resultado.rows;
    } else {
      let entorno = 'local';
      if (process.env.NODE_ENTORNO === entorno) {
        connection = await mysql.createConnection(configuracomLocal.db);
      } else {
        connection = await mysql.createConnection(configRailway);
        entorno = 'posgreSQL railway';
      }
      dados = await connection.execute(sql, params);
      if (dados && dados[0]) {
        console.log(`💿 ${entorno} dados[0].length ${dados[0].length}`);
        return dados[0];
      }
    }
  } catch (err) {
    console.error('Erro ao realiçar o GET:', err);
    throw new Error('Erro sobre a base de dados');
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

function ePosgreSQL() {
    const posgre = process.env.QUAL_SQL?.length > 8 && process.env.QUAL_SQL?.substring(0, 9) === 'PosgreSQL'
    return posgre;
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

export default {
  query, ePosgreSQL, stringOuNull, stringOuNullSimple, numberOuNull, numberOu0, pool
}