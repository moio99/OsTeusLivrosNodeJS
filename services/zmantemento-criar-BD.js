import db from '../utils/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
}

function getFilenamePrefix() {
  return `bd-${new Date().toISOString().slice(0, 10)}`;
}

async function ciarSQLsCriacomBD(nomeBD = getFilenamePrefix()) {
  console.log('Petiçom de ciarSQLsCriacomBD ' + new Date().toJSON());

  const nomePasta = getFilenamePrefix();

  try {
    // Obtém lista de tabelas da base de dados atual
    const tablesRows = await db.query('SHOW TABLES');
    const tableNames = [];
    if (tablesRows && tablesRows.length > 0) {
      const key = Object.keys(tablesRows[0])[0];
      for (const r of tablesRows) {
        tableNames.push(r[key]);
      }
    }

    let content = '';
    content += `delimiter $$\nCREATE DATABASE \`${nomeBD}\` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */$$\n\n`;

    for (const table of tableNames) {
      try {
        const createRows = await db.query(`SHOW CREATE TABLE \`${table}\``);
        if (!createRows || createRows.length === 0) continue;
        const createKey = Object.keys(createRows[0]).find(k => k.toLowerCase().includes('create'));
        let createSql = createRows[0][createKey];

        // Prepend database name to the CREATE TABLE header:
        const lines = createSql.split('\n');
        if (lines.length > 0 && lines[0].startsWith('CREATE TABLE')) {
          lines[0] = lines[0].replace(/CREATE TABLE\s+`?([^`(]+)`?/, `CREATE TABLE \`${nomeBD}\`.\`$1\``);
          createSql = lines.join('\n');
        }

        content += `delimiter $$\n${createSql}$$\n\n`;
      } catch (innerErr) {
        console.error(`Erro ao obter CREATE TABLE para ${table}:`, innerErr.message);
      }
    }

    const outDir = path.join(__dirname, '..', 'data');
    await fs.mkdir(outDir, { recursive: true });
    const fileName = `QueriesCriacom_${nomeBD}.txt`;
    const outPath = path.join(outDir, fileName);
    await fs.writeFile(outPath, content, 'utf8');
    console.log(`Ficheiro escrito: ${outPath}`);
    return outPath;
  } catch (err) {
    console.error(`Erro ao executar ciarSQLsCriacomBD em zmantemento-salvar-dados.js`, err.message);
    return false;
  }
}

export default {
  ciarSQLsCriacomBD,
};