import db from '../utils/db.js';
import helper from '../utils/helper.js';

async function getPaginasPorIdiomaEAno(idUsuario){
  console.log('💬 Petiçom de getPaginasPorIdiomaEAno ' + new Date().toJSON());

  let quantidadepaginasUU = ', CONVERT(SUM(uu.quantidadepaginas), UNSIGNED) as "quantidadepaginas"';
  let quantidadepaginasL = ', CONVERT(SUM(l.PaginasLidas), UNSIGNED) as "quantidadepaginas"';
  let quantidadepaginasR = ', CONVERT(SUM(r.PaginasLidas), UNSIGNED) as "quantidadepaginas"';
  
  let anoLivro = 'YEAR(l.DataFimLeitura)';
  let anoRelectura = 'YEAR(r.DataFimLeitura)';

  if (db.ePosgreSQL()) {
    quantidadepaginasUU = ', SUM(uu.quantidadepaginas)::INTEGER as "quantidadepaginas"';
    quantidadepaginasL = ', SUM(l.PaginasLidas)::INTEGER as "quantidadepaginas"';
    quantidadepaginasR = ', SUM(r.PaginasLidas)::INTEGER as "quantidadepaginas"';
    
    anoLivro = 'EXTRACT(YEAR FROM l.DataFimLeitura)::INTEGER';
    anoRelectura = 'EXTRACT(YEAR FROM r.DataFimLeitura)::INTEGER';
  }

    
  const query = `SELECT uu.id, uu.idioma, uu.idIdioma as "idIdioma" ${quantidadepaginasUU}
    FROM (
      SELECT ${anoLivro} AS id, i.Nome AS idioma, l.fkIdioma AS idIdioma ${quantidadepaginasL}
        FROM Livro l
            RIGHT JOIN Idioma i ON l.fkIdioma = i.idIdioma
        WHERE l.fkUsuario = ${idUsuario}
        AND l.Lido = true AND l.DataFimLeitura IS NOT NULL
        GROUP BY ${anoLivro}, idioma, idIdioma, fkidioma 
      UNION ALL
      SELECT ${anoRelectura} AS id, i.Nome AS idioma, r.fkIdioma AS idIdioma ${quantidadepaginasR}
        FROM Relectura r
            RIGHT JOIN Idioma i ON r.fkIdioma = i.idIdioma
        WHERE r.fkUsuario = ${idUsuario}
        AND r.Lido = true AND r.DataFimLeitura IS NOT NULL
        GROUP BY ${anoRelectura}, idioma, idIdioma, fkidioma
      ) AS uu
    GROUP BY uu.id, uu.idioma, uu.idIdioma
    ORDER BY uu.id ASC, uu.idioma ASC`;
  
    const data = await db.query(query);
    const dataRows = helper.emptyOrRows(data);
    console.log(`✅ ${dataRows.length} elementos obtidos`);
  
    const meta = {'info': 'nada'};
    return {
      data,
      meta
    }
}

export default {
  getPaginasPorIdiomaEAno
}
