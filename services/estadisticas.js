const db = require('../utils/db');
const helper = require('../utils/helper');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/DadosEstadisticas');

const queryPorIdioma = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade
, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) AS quantidadepaginas
, CONVERT(SUM(uu.numRelecturas), UNSIGNED) AS "quantidadeRelecturas"
FROM (
  SELECT l.fkIdioma AS id, i.Nome AS nome, l.PaginasLidas, 0 AS numRelecturas
    FROM Livro l
        RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
    WHERE l.fkUsuario = {idUsuario_reemprazo}
    AND l.Lido = true
    -- AND (l.idSerie IS NULL OR l.idSerie =  0)
  UNION ALL
    SELECT r.fkIdioma AS id, i.Nome AS nome, r.PaginasLidas, 1 AS numRelecturas
    FROM Relectura r
        RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
    WHERE r.fkUsuario = {idUsuario_reemprazo}
    AND r.Lido = true
    -- AND (r.idSerie IS NULL OR r.idSerie =  0)
  ) AS uu
GROUP BY uu.id, uu.nome
ORDER BY quantidade DESC, lower(nome) ASC;`;
const queryPorGenero = `SELECT uu.id, uu.nome
  , COUNT(uu.id) as quantidade, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) as quantidadepaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) as "quantidadeRelecturas"
  FROM (
      SELECT g.idGenero as id, g.Nome as nome, l.PaginasLidas, 0 as numRelecturas
      FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = true
    UNION ALL
      SELECT g.idGenero as id, g.Nome as nome, r.PaginasLidas, 1 as numRelecturas
      FROM Relectura r  
        INNER JOIN Livro l ON r.fkLivro = l.idLivro
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = true
  ) as uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(uu.nome) ASC`;
const queryPorAno = `SELECT uu.id, uu.nome
  , COUNT(uu.id) as quantidade, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) as quantidadepaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) as "quantidadeRelecturas"
  FROM (
      SELECT YEAR(l.DataFimLeitura) as id, YEAR(l.DataFimLeitura) as nome, l.PaginasLidas, 0 as numRelecturas
      FROM Livro l
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = true
    UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, YEAR(r.DataFimLeitura) as nome, r.PaginasLidas, 1 as numRelecturas
      FROM Relectura r
      WHERE r.fkUsuario = {idUsuario_reemprazo}
      AND r.Lido = true
    ) AS uu
  GROUP BY uu.id, uu.nome
  ORDER BY uu.id DESC;`;
const queryPorAutor = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade
  , CONVERT(SUM(uu.PaginasLidas), UNSIGNED) AS quantidadepaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) AS "quantidadeRelecturas" 
  FROM (
    SELECT ar.idAutor as id, ar.Nome as nome, l.PaginasLidas, 0 AS numRelecturas
      FROM Livro l
      RIGHT JOIN Autores ars ON l.idLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = true
      -- AND (l.idSerie IS NULL OR l.idSerie =  0)
    UNION ALL
    SELECT ar.idAutor as id, ar.Nome as nome, r.PaginasLidas, 1 AS numRelecturas
      FROM Relectura r
      RIGHT JOIN Autores ars ON r.fkLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE r.fkUsuario = {idUsuario_reemprazo} AND r.Lido = true
      -- AND (r.idSerie IS NULL OR r.idSerie =  0)
  ) as uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(nome) ASC;`;

async function getEstadisticas(idUsuario, tipo){
  console.log('Petiçom de getEstadisticas para o tipo: ' + tipo)
  let dados;
  switch (tipo) {
    case '1':
      dados = await db.query(queryPorIdioma.replaceAll('{idUsuario_reemprazo}', idUsuario));
      break;
    case '2':
      dados = await db.query(queryPorGenero.replaceAll('{idUsuario_reemprazo}', idUsuario));
      break;
    case '3':
      dados = await db.query(queryPorAno.replaceAll('{idUsuario_reemprazo}', idUsuario));
      break;
    case '4':
      dados = await db.query(queryPorAutor.replaceAll('{idUsuario_reemprazo}', idUsuario));
      break;
    default:
      return ''
  }
  const data = await GestomDados(dados, tipo);

  return data;
}

async function GestomDados(dados, tipo){
  let origemDados = 'BD';
  let data = helper.emptyOrRows(dados);
  if (tipo !== '4') {
    if (data?.length > 0) {
      if (process.env.NODE_ENTORNO === 'local') {
        await EscreverFicheiroJSON(data, tipo);
      }
    } else {
      const dataJS = await LerFicheiroJSON(tipo);
      data = JSON.parse(dataJS);
      origemDados = 'Ficheiro JSON';
    }
  }
  
  console.log(data.length + ' elementos devoltos');
  const meta = {'tipo': tipo, origemDados: origemDados};
  return {
    data,
    meta
  };
}

async function EscreverFicheiroJSON(dados, tipo) {
  const nomeArquivo = DATA_FILE + tipo + '.json';
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

async function LerFicheiroJSON(tipo) {
  const nomeArquivo = DATA_FILE + tipo + '.json';
  try {
    const data = await fs.readFile(nomeArquivo, 'utf8');
    return data;
  } catch (error) {
    console.error('Erro ao ler o arquivo das estadísticas fallback:', error.message);
    throw new Error('Nom foi posível obtener dados nem da API nem do arquivo fallback');
  }
}


module.exports = {
  getEstadisticas
}
