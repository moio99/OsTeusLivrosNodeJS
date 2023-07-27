const db = require('./db');
const helper = require('../helper');

const queryPorIdioma = `SELECT Livro.fkIdioma as id, Idioma.Nome as nome
    , COUNT(Livro.idLivro) as quantidade, CONVERT(SUM(Livro.PaginasLidas), UNSIGNED) as quantidadePaginas
  FROM Livro, Idioma
  WHERE Livro.fkUsuario = 2
  AND Livro.fkIdioma = Idioma.idIdioma
  AND Livro.Lido = 1
  -- AND (Livro.idSerie IS NULL OR Livro.idSerie =  0)
  GROUP BY Livro.fkIdioma
  ORDER BY quantidade DESC, lower(nome) ASC;`;
const queryPorGenero = `SELECT g.idGenero as id, g.Nome as nome, COUNT(l.idLivro) as quantidade
    , CONVERT(SUM(l.PaginasLidas), UNSIGNED) as quantidadePaginas
  FROM Livro l
  INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
  INNER JOIN Genero g ON g.idGenero = gs.fkGenero
  WHERE l.fkUsuario = 2
  AND l.Lido = 1
  GROUP BY g.idGenero
  ORDER BY quantidade DESC, lower(g.Nome) ASC`;
const queryPorAno = `SELECT YEAR(DataFimLeitura) as id, YEAR(DataFimLeitura) as nome, COUNT(Livro.idLivro) as quantidade
    , CONVERT(SUM(Livro.PaginasLidas), UNSIGNED) as quantidadePaginas
  FROM Livro
  WHERE Livro.fkUsuario = 2
  AND Livro.Lido = 1
  GROUP BY YEAR(DataFimLeitura)
  ORDER BY YEAR(DataFimLeitura) DESC;`;
const queryPorAutor = `SELECT Autor.idAutor as id, Autor.Nome as nome, COUNT(Livro.idLivro) as quantidade
    , CONVERT(SUM(Livro.PaginasLidas), UNSIGNED) as quantidadePaginas
  FROM Livro, Autores, Autor
  WHERE Livro.fkUsuario = 2
  AND Livro.idLivro = Autores.fkLivro
  AND Autores.fkAutor = Autor.idAutor
  AND Livro.Lido = 1
  -- AND (Livro.idSerie IS NULL OR Livro.idSerie =  0)
  GROUP BY Autor.idAutor
  ORDER BY quantidade DESC, lower(nome) ASC;`;

async function getEstadisticas(tipo){
  console.log('Petiçom de getEstadisticas para o tipo: ' + tipo)
  let dados;
  switch (tipo) {
    case '1':
      dados = await db.query(queryPorIdioma);
      break;
    case '2':
      dados = await db.query(queryPorGenero);
      break;
    case '3':
      dados = await db.query(queryPorAno);
      break;
    case '4':
      dados = await db.query(queryPorAutor);
      break;
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
