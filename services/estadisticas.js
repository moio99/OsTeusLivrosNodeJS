import db from '../utils/db.js';
import helper from '../utils/helper.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/DadosEstadisticas');

const quantidade = db.ePosgreSQL() ?
    `, SUM(uu.PaginasLidas)::INTEGER AS quantidadepaginas
     , SUM(uu.numRelecturas)::INTEGER AS "quantidadeRelecturas"`
  : `, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) AS quantidadepaginas
     , CONVERT(SUM(uu.numRelecturas), UNSIGNED) AS "quantidadeRelecturas"`;
const concatenacom = db.ePosgreSQL() ? `string_agg(` : `GROUP_CONCAT(`;
const concatenacomFim = db.ePosgreSQL() ? `::text, ',')` : `)`;

const queryPorIdioma = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade ${quantidade}
  FROM (
    SELECT l.fkIdioma AS id, i.Nome AS nome, l.PaginasLidas, 0 AS numRelecturas
      FROM Livro l
          RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = true
      -- AND (l.idSerie IS NULL OR l.idSerie =  0)
    UNION ALL
      SELECT r.fkIdioma AS id, i.Nome AS nome, r.PaginasLidas, 1 AS numRelecturas -- se fosem mais de um sumarase
      FROM Relectura r
          RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
      WHERE r.fkUsuario = {idUsuario_reemprazo}
      AND r.Lido = true
      -- AND (r.idSerie IS NULL OR r.idSerie =  0)
    ) AS uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(nome) ASC;`;
const queryPorGenero = `SELECT uu.id, uu.nome, ${concatenacom}ano${concatenacomFim} AS anos
  , COUNT(uu.id) as quantidade ${quantidade}
  FROM (
      SELECT g.idGenero as id, g.Nome as nome, l.PaginasLidas, YEAR(l.DataFimLeitura) as ano
        , 0 as numRelecturas
      FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = true
    UNION ALL
      SELECT g.idGenero as id, g.Nome as nome, r.PaginasLidas, YEAR(r.DataFimLeitura) as ano
        , 1 as numRelecturas -- se fosem mais de um sumarase
      FROM Relectura r
        INNER JOIN Livro l ON r.fkLivro = l.idLivro
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = true
  ) as uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(uu.nome) ASC`;

const queryPorAno = `SELECT uu.id, uu.nome, ${concatenacom}idsGenero${concatenacomFim} AS generos
  , COUNT(uu.id) as quantidade ${quantidade}
  FROM (
      SELECT YEAR(l.DataFimLeitura) as id, YEAR(l.DataFimLeitura) as nome
        , l.PaginasLidas, ${concatenacom}g.idGenero${concatenacomFim} as idsGenero, 0 as numRelecturas
      FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = true
      GROUP BY l.DataFimLeitura, l.paginaslidas
    UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, YEAR(r.DataFimLeitura) as nome
        , r.PaginasLidas, ${concatenacom}g.idGenero${concatenacomFim} as idsGenero, 1 as numRelecturas -- se fosem mais de um sumarase
      FROM Relectura r
        INNER JOIN Livro l ON r.fkLivro = l.idLivro
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE r.fkUsuario = {idUsuario_reemprazo}
      AND r.Lido = true
      GROUP BY r.DataFimLeitura, r.PaginasLidas
    ) AS uu
  GROUP BY uu.id, uu.nome
  ORDER BY uu.id DESC;`;

const queryPorAutor = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade ${quantidade}
  FROM (
    SELECT ar.idAutor as id, ar.Nome as nome, l.PaginasLidas, 0 AS numRelecturas
      FROM Livro l
      RIGHT JOIN Autores ars ON l.idLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = true
      -- AND (l.idSerie IS NULL OR l.idSerie =  0)
    UNION ALL
    SELECT ar.idAutor as id, ar.Nome as nome, r.PaginasLidas, 1 AS numRelecturas -- se fosem mais de um sumarase
      FROM Relectura r
      RIGHT JOIN Autores ars ON r.fkLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE r.fkUsuario = {idUsuario_reemprazo} AND r.Lido = true
      -- AND (r.idSerie IS NULL OR r.idSerie =  0)
  ) as uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(nome) ASC;`;

async function getEstadisticas(idUsuario, tipo){
  console.log('💬 Petiçom de getEstadisticas para o tipo: ' + tipo)
  let dados;
  switch (tipo) {
    case '1':
      const queryPorIdiomaLista = queryPorIdioma.replaceAll('{idUsuario_reemprazo}', idUsuario);
      dados = await db.query(queryPorIdiomaLista);
      break;
    case '2':
      const rowsGeneros = await db.query(queryPorGenero.replaceAll('{idUsuario_reemprazo}', idUsuario));
      dados = rowsGeneros.map(value => {
          const matrizAnos = value.anos 
            ? value.anos.split(',').map(Number)   // Convirto "2021,2022" para [2021, 2022]
            : [];

          return {
            ...value,
            anos: matrizAnos
          };
        }
      );
      break;
    case '3':
      const rowsAnos = await db.query(queryPorAno.replaceAll('{idUsuario_reemprazo}', idUsuario));
      dados = rowsAnos.map(value => {
          const matrizGeneros = value.generos 
            ? value.generos.split(',').map(Number)   // Convirto "2,15,17" para [2, 15, 17]
            : [];

          return {
            ...value,
            generos: matrizGeneros
          };
        }
      );
      break;
    case '4':
      dados = await db.query(queryPorAutor.replaceAll('{idUsuario_reemprazo}', idUsuario));
      break;
    default:
      return ''
  }
  const data = await GestomDados(dados, tipo, idUsuario);

  return data;
}

async function GestomDados(dados, tipo, idUsuario){
  let origemDados = 'BD';
  let data = helper.emptyOrRows(dados);
  if (tipo !== '4') {
    if (data?.length > 0) {
      if (process.env.NODE_ENTORNO === 'local') {
        await EscreverFicheiroJSON(data, tipo, idUsuario);
      }
    } else {
      const dataJS = await LerFicheiroJSON(tipo, idUsuario);
      data = dataJS;
      origemDados = 'Ficheiro JSON';
    }
  }
  
  console.log(data.length + ' elementos obtidos. ' + origemDados);
  const meta = {'tipo': tipo, origemDados: origemDados};
  return {
    data,
    meta
  };
}

async function EscreverFicheiroJSON(dados, tipo, idUsuario) {
  const nomeArquivo = `${DATA_FILE}_${tipo}_${idUsuario}.json`;
  const dadosJson = JSON.stringify(dados, null, 2);
  try {
    const existingData = await fs.readFile(nomeArquivo, 'utf8');
    
    if (dadosJson.length !== existingData.length) {
      await fs.writeFile(nomeArquivo, dadosJson);
    }
  } catch (error) {
    await fs.writeFile(nomeArquivo, dadosJson);
    console.log('dados escritos NOVO ficheiro');
  }
}

async function LerFicheiroJSON(tipo, idUsuario) {
  const nomeArquivo = `${DATA_FILE}_${tipo}_${idUsuario}.json`;
  try {
    const data = await fs.readFile(nomeArquivo, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('O arquivo json nom existe. Devolvendo estrutura baleira.');
    } else {
      console.error('Erro ao ler o arquivo de estatísticas:', error.message);
    }
    return [];
  }
}


export default {
  getEstadisticas
}
