const db = require('./db');
const helper = require('../helper');

async function getPaginasPorIdiomaEAno(){
  console.log('Petiçom de getPaginasPorIdiomaEAno ' + new Date().toJSON());
    
  const query = `SELECT uu.id, uu.idioma, uu.idIdioma, CONVERT(SUM(uu.quantidadePaginas), UNSIGNED) as quantidadePaginas
    FROM (
      SELECT YEAR(l.DataFimLeitura) as id, i.Nome AS idioma, l.fkIdioma as idIdioma
      , CONVERT(SUM(l.PaginasLidas), UNSIGNED) as quantidadePaginas
        FROM Livro l
            RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
        WHERE l.fkUsuario = 2
        AND l.Lido = 1
        GROUP BY id, idioma, idIdioma
      UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, i.Nome AS idioma, r.fkIdioma as idIdioma
      , CONVERT(SUM(r.PaginasLidas), UNSIGNED) as quantidadePaginas
        FROM Relectura r
            RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
        WHERE r.fkUsuario = 2
        AND r.Lido = 1
        GROUP BY id, idioma, idIdioma
      ) AS uu
    GROUP BY uu.id, uu.idioma
    ORDER BY uu.id ASC, uu.idioma ASC`;
  
    const data = await db.query(query);
    const dataRows = helper.emptyOrRows(query);
    console.log(dataRows.length + ' elementos devoltos');
  
    const meta = {'nada': 'nada'};
    console.log(data)
  
    return {
      data,
      meta
    }
}

module.exports = {
  getPaginasPorIdiomaEAno
}
