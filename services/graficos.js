const db = require('../utils/db');
const helper = require('../utils/helper');

async function getPaginasPorIdiomaEAno(idUsuario){
  console.log('Petiçom de getPaginasPorIdiomaEAno ' + new Date().toJSON());
    
  const query = `SELECT uu.id, uu.idioma, uu.idIdioma, CONVERT(SUM(uu.quantidadePaginas), UNSIGNED) as quantidadePaginas
    FROM (
      SELECT YEAR(l.DataFimLeitura) as id, i.Nome AS idioma, l.fkIdioma as idIdioma
      , CONVERT(SUM(l.PaginasLidas), UNSIGNED) as quantidadePaginas
        FROM Livro l
            RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
        WHERE l.fkUsuario = ${idUsuario}
        AND l.Lido = 1
        GROUP BY id, idioma, idIdioma
      UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, i.Nome AS idioma, r.fkIdioma as idIdioma
      , CONVERT(SUM(r.PaginasLidas), UNSIGNED) as quantidadePaginas
        FROM Relectura r
            RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
        WHERE r.fkUsuario = ${idUsuario}
        AND r.Lido = 1
        GROUP BY id, idioma, idIdioma
      ) AS uu
    GROUP BY uu.id, uu.idioma, uu.idIdioma
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
