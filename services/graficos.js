const db = require('../utils/db');
const helper = require('../utils/helper');

async function getPaginasPorIdiomaEAno(idUsuario){
  console.log('Petiçom de getPaginasPorIdiomaEAno ' + new Date().toJSON());

  let quantidadepaginasUU = ', CONVERT(SUM(uu.quantidadepaginas), UNSIGNED) as "quantidadepaginas"';
  let quantidadepaginasL = ', CONVERT(SUM(l.PaginasLidas), UNSIGNED) as "quantidadepaginas"';
  let quantidadepaginasR = ', CONVERT(SUM(r.PaginasLidas), UNSIGNED) as "quantidadepaginas"';
  if (process.env.QUAL_SQL?.length > 8 && process.env.QUAL_SQL?.substring(0, 9) === 'PosgreSQL') {
    quantidadepaginasUU = ', SUM(uu.quantidadepaginas)::INTEGER as "quantidadepaginas"';
    quantidadepaginasL = ', SUM(l.PaginasLidas)::INTEGER as "quantidadepaginas"';
    quantidadepaginasR = ', SUM(r.PaginasLidas)::INTEGER as "quantidadepaginas"';
  }
    
  const query = `SELECT uu.id, uu.idioma, uu.idIdioma as "idIdioma" ${quantidadepaginasUU}
    FROM (
      SELECT YEAR(l.DataFimLeitura) as id, i.Nome AS idioma, l.fkIdioma as idIdioma ${quantidadepaginasL}
        FROM Livro l
            RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
        WHERE l.fkUsuario = ${idUsuario}
        AND l.Lido = true
        GROUP BY id, idioma, idIdioma, fkidioma
      UNION ALL
      SELECT YEAR(r.DataFimLeitura) as id, i.Nome AS idioma, r.fkIdioma as idIdioma ${quantidadepaginasR}
        FROM Relectura r
            RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
        WHERE r.fkUsuario = ${idUsuario}
        AND r.Lido = true
        GROUP BY id, idioma, idIdioma, fkidioma
      ) AS uu
    GROUP BY uu.id, uu.idioma, uu.idIdioma
    ORDER BY uu.id ASC, uu.idioma ASC`;
  
    const data = await db.query(query);
    const dataRows = helper.emptyOrRows(query);
    console.log(dataRows.length + ' elementos devoltos');
  
    const meta = {'nada': 'nada'};
    return {
      data,
      meta
    }
}

module.exports = {
  getPaginasPorIdiomaEAno
}
