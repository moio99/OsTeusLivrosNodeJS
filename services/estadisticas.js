const db = require('../utils/db');
const helper = require('../utils/helper');

const queryPorIdioma = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade
, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) AS quantidadePaginas
, CONVERT(SUM(uu.numRelecturas), UNSIGNED) AS quantidadeRelecturas
FROM (
  SELECT l.fkIdioma AS id, i.Nome AS nome, l.PaginasLidas, 0 AS numRelecturas
    FROM Livro l
        RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
    WHERE l.fkUsuario = {idUsuario_reemprazo}
    AND l.Lido = 1
    -- AND (l.idSerie IS NULL OR l.idSerie =  0)
  UNION ALL
    SELECT r.fkIdioma AS id, i.Nome AS nome, r.PaginasLidas, 1 AS numRelecturas
    FROM Relectura r
        RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
    WHERE r.fkUsuario = {idUsuario_reemprazo}
    AND r.Lido = 1
    -- AND (r.idSerie IS NULL OR r.idSerie =  0)
  ) AS uu
GROUP BY uu.id, uu.nome
ORDER BY quantidade DESC, lower(nome) ASC;`;
const queryPorGenero = `SELECT uu.id, uu.nome
  , COUNT(uu.id) as quantidade, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) as quantidadePaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) as quantidadeRelecturas
  FROM (
      SELECT g.idGenero as id, g.Nome as nome, l.PaginasLidas, 0 as numRelecturas
      FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = 1
    UNION ALL
      SELECT g.idGenero as id, g.Nome as nome, r.PaginasLidas, 1 as numRelecturas
      FROM Relectura r  
        INNER JOIN Livro l ON r.fkLivro = l.idLivro
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = 1
  ) as uu
  GROUP BY uu.id, uu.nome
  ORDER BY quantidade DESC, lower(uu.nome) ASC`;
const queryPorAno = `SELECT uu.id, uu.nome
  , COUNT(uu.id) as quantidade, CONVERT(SUM(uu.PaginasLidas), UNSIGNED) as quantidadePaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) as quantidadeRelecturas
  FROM (
      SELECT YEAR(l.DataFimLeitura) as id, YEAR(l.DataFimLeitura) as nome, l.PaginasLidas, 0 as numRelecturas
      FROM Livro l
      WHERE l.fkUsuario = {idUsuario_reemprazo}
      AND l.Lido = 1
    UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, YEAR(r.DataFimLeitura) as nome, r.PaginasLidas, 1 as numRelecturas
      FROM Relectura r
      WHERE r.fkUsuario = {idUsuario_reemprazo}
      AND r.Lido = 1
    ) AS uu
  GROUP BY uu.id, uu.nome
  ORDER BY uu.id DESC;`;
const queryPorAutor = `SELECT uu.id, uu.nome, count(uu.id) AS quantidade
  , CONVERT(SUM(uu.PaginasLidas), UNSIGNED) AS quantidadePaginas
  , CONVERT(SUM(uu.numRelecturas), UNSIGNED) AS quantidadeRelecturas 
  FROM (
    SELECT ar.idAutor as id, ar.Nome as nome, l.PaginasLidas, 0 AS numRelecturas
      FROM Livro l
      RIGHT JOIN Autores ars ON l.idLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE l.fkUsuario = {idUsuario_reemprazo} AND l.Lido = 1
      -- AND (l.idSerie IS NULL OR l.idSerie =  0)
    UNION ALL
    SELECT ar.idAutor as id, ar.Nome as nome, r.PaginasLidas, 1 AS numRelecturas
      FROM Relectura r
      RIGHT JOIN Autores ars ON r.fkLivro = ars.fkLivro
      RIGHT JOIN Autor ar ON ars.fkAutor = ar.idAutor
      WHERE r.fkUsuario = {idUsuario_reemprazo} AND r.Lido = 1
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
  const data = helper.emptyOrRows(dados);
  const meta = {'tipo': tipo};

  return {
    data,
    meta
  }
}

module.exports = {
  getEstadisticas
}
