const db = require('./db');
const helper = require('../helper');

async function getLivros(){
  console.log('Petiçom de getLivros');
  let select = `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.Paginas as paginas
    , l.DataFimLeitura as dataFimLeitura
    , ar.idAutor, ar.Nome as nomeAutor
    , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
    , (SELECT COUNT(rr.idRelectura) FROM relectura rr WHERE rr.fkLivro = l.idLivro) as quantidadeRelecturas
    FROM Livro l
    LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
    LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
    WHERE l.fkUsuario = 2 
    ORDER BY lower(l.Titulo) ASC;`;
  const dados = await db.query(select);

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': 0, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

// Para evitar ter na BD dous co mesmo Titulo.
async function getLivroPorTitulo(titulo){
  console.log(titulo + ' <<<<<<<<< titulo');
  console.log('Petiçom de getLivroPorTitulo ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT l.idLivro as id
      FROM Livro l
      WHERE l.fkUsuario = 2 AND l.Titulo like '%${titulo}%' ;`
  );
  
  const livro = helper.emptyOrRows(dadosLivro);
  console.log(livro.length + ' elementos devoltos');

  const meta = {'id': livro.length > 0 ? livro[0].id : 0, 'quantidade': livro.length};

  return {
    livro,
    meta
  }
}

async function getLivrosUltimaLectura(){
  console.log('Petiçom de getLivrosUltimaLectura');
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
    , ar.idAutor, ar.Nome as nomeAutor
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 AND l.Lido = 1
      ORDER BY DataFimLeitura DESC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': 0, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorIdioma(idioma){
  console.log('Petiçom de getLivrosPorIdioma para o idioma: ' + idioma);
  const dados = await db.query(
    `SELECT uu.* FROM (
      SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.Paginas as paginas, l.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
        , '0' as idRelectura
        FROM Livro l
        INNER JOIN Idioma i ON l.fkIdioma = i.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = 2
        AND i.idIdioma = ${idioma}
    UNION ALL
      SELECT l.idLivro as id, r.Titulo as titulo, l.TituloOriginal as tituloOriginal, r.Paginas as paginas, r.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
        , r.idRelectura as idRelectura
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        INNER JOIN Idioma i ON r.fkIdioma = i.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = 2
        AND i.idIdioma = ${idioma}
    ) AS uu
    ORDER BY uu.Titulo, lower(uu.nomeAutor) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Idioma': idioma};

  return {
    data,
    meta
  }
}

async function getLivrosPorAno(ano){
  console.log('Petiçom de getLivrosPorAno para o ano: ' + ano);
  const dados = await db.query(
    `SELECT uu.* FROM (
      SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.Paginas as paginas, l.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
        , '0' as idRelectura
        FROM Livro l
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
        WHERE l.fkUsuario = 2 
        AND YEAR(l.DataFimLeitura) = ${ano} AND l.Lido = '1'
    UNION ALL
      SELECT l.idLivro as id, r.Titulo as titulo, l.TituloOriginal as tituloOriginal, r.Paginas as paginas, r.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = r.idRelectura) as quantidadeSerie
        , r.idRelectura as idRelectura
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
        WHERE r.fkUsuario = 2 
        AND YEAR(r.DataFimLeitura) = ${ano} AND r.Lido = '1'  
    ) AS uu
    ORDER BY uu.Titulo, lower(uu.nomeAutor) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Ano': ano};

  return {
    data,
    meta
  }
}

async function getLivrosPorAutor(id){
  console.log('Petiçom de getLivrosPorAutor para o idAutor: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
      , l.lido
      , ar.idAutor, ar.Nome as nomeAutor
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      INNER JOIN Autores ars ON l.idLivro = ars.fkLivro 
      INNER JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 
      AND ar.idAutor = ${id}
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorGenero(genero){
  console.log('Petiçom de getLivrosPorGenero para o genero: ' + genero);
  const dados = await db.query(
    `SELECT uu.* FROM (
      SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.Paginas as paginas, l.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
        , (SELECT COUNT(rr.idRelectura) FROM relectura rr WHERE rr.fkLivro = l.idLivro) as quantidadeRelecturas
        , '0' as idRelectura
        FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = 2 
        AND gs.fkGenero = ${genero}
    UNION ALL
      SELECT l.idLivro as id, r.Titulo as titulo, l.TituloOriginal as tituloOriginal, r.Paginas as paginas, r.DataFimLeitura as dataFimLeitura
        , ar.idAutor, ar.Nome as nomeAutor
        , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
        , (SELECT COUNT(rr.idRelectura) FROM relectura rr WHERE rr.fkLivro = l.idLivro) as quantidadeRelecturas
        , r.idRelectura as idRelectura
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = 2 
        AND gs.fkGenero = ${genero}
    ) AS uu
    ORDER BY uu.Titulo, lower(uu.nomeAutor) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Genero': genero};

  return {
    data,
    meta
  }
}

async function getLivrosPorEditorial(id){
  console.log('Petiçom de getLivrosPorEditorial para o idEditorial: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
      , ar.idAutor, ar.Nome as nomeAutor      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      INNER JOIN Editorial e ON l.fkEditorial = e.idEditorial 
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 
      AND e.idEditorial = ${id}
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorBiblioteca(id){
  console.log('Petiçom de getLivrosPorBiblioteca para a idBiblioteca: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
      , ar.idAutor, ar.Nome as nomeAutor      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      INNER JOIN Biblioteca b ON l.fkBiblioteca = b.idBiblioteca
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 
      AND b.idBiblioteca = ${id}
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorColecom(id){
  console.log('Petiçom de getLivrosPorColecom para a idColecom: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
      , ar.idAutor, ar.Nome as nomeAutor      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      INNER JOIN Colecom c ON l.fkColecom = c.idColecom
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 
      AND c.idColecom = ${id}
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorEstiloLiterario(id){
  console.log('Petiçom de getLivrosPorEstiloLiterario para a idEstiloLiterario: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, l.DataFimLeitura as dataFimLeitura
      , ar.idAutor, ar.Nome as nomeAutor      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      INNER JOIN estiloLiterario e ON l.fkEstilo = e.idEstilo
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = 2 
      AND e.idEstilo = ${id}
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosSerie(id){
  console.log('Petiçom de getLivrosSerie para o idLivro: ' + id);
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as titulo, l.TituloOriginal as tituloOriginal, ar.idAutor, ar.Nome as nomeAutor
      FROM Livro l
      WHERE l.fkUsuario = 2 
      AND l.idSerie = ${id} 
      ORDER BY l.Titulo, lower(ar.Nome) ASC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LibroConMaisDeUnAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

/**
 * Se um livro tem mais dum autor, aparece repetido, esta funçom junta essos resgistros.
 * @param {*} data dados da consulta.
 * @returns Listado cos livros.
 */
function LibroConMaisDeUnAutor(data) {
  let resultados = [];
  let idLivroAnterior = 0;
  //let nRepeticons = 1;
  for (var i = 0; i < data.length; i++) { 
    if (idLivroAnterior != data[i].id) {
      data[i].autores = [{id: data[i].idAutor, nome: data[i].nomeAutor}]
      resultados.push(data[i]);
      //nRepeticons = 1;
    }
    else {
      // O dabaixo funciona porque resultados tem umha referência a data[i - nRepeticons], nom umha cópia.
      //data[i - nRepeticons].nomeAutor += ', ' + data[i].nomeAutor;
      resultados[resultados.length - 1].nomeAutor += ', ' + data[i].nomeAutor;
      resultados[resultados.length - 1].autores.push({id: data[i].idAutor, nome: data[i].nomeAutor});
      //++nRepeticons;
    }
    idLivroAnterior = data[i].id;
  }
  return resultados;
}

async function getLivro(id){
  console.log('Petiçom de getLivro para o id: ' + id);
  let query = `SELECT
      l.idLivro, l.Titulo, l.TituloOriginal
      , b.idBiblioteca, b.Nome as biblioteca
      , e.idEditorial, e.Nome as editorial
      , c.idColecom, c.Nome as colecom
      , el.idEstilo, el.Nome as estilo
      , l.fkBiblioteca, l.fkEditorial, l.fkColecom, l.fkEstilo, l.ISBN
      , l.Paginas, l.PaginasLidas, l.Lido, l.TempoLeitura
      , DATE_FORMAT(l.DataFimLeitura,'%d/%m/%Y') as DataFimLeitura
      , l.fkIdioma, l.fkIdiomaOriginal
      , DATE_FORMAT(l.DataCriacom,'%d/%m/%Y') as DataCriacom
      , DATE_FORMAT(l.DataEdicom,'%d/%m/%Y') as DataEdicom
      , l.NumeroEdicom, l.Electronico
      , l.SomSerie, l.idSerie, l.Premios, l.Descricom, l.Comentario, l.Pontuacom
      , ar.idAutor, ar.Nome as nomeAutor
      , gn.idGenero, gn.Nome as nomeGenero
    FROM Livro l
    LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
    LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
    LEFT JOIN Generos gns ON l.idLivro = gns.fkLivro 
    LEFT JOIN Genero gn ON gns.fkGenero = gn.idGenero  
    LEFT JOIN Biblioteca b ON l.fkBiblioteca = b.idBiblioteca 
    LEFT JOIN Editorial e ON l.fkEditorial = e.idEditorial 
    LEFT JOIN Colecom c ON l.fkColecom = c.idColecom 
    LEFT JOIN EstiloLiterario el ON l.fkEstilo = el.idEstilo 
    WHERE l.idLivro = ${id};`;
  const dadosLivro = await db.query(query);
  
  const data = helper.emptyOrRows(dadosLivro);
  if (data.length > 0) {

    let autores = [];
    for (let i = 0; i < data.length; i++) {
      let af = autores.find(a => a.id === data[i].idAutor);
      if (!af && data[i].idAutor) {       // Se nom o atopa e data[i].idAutor nom é null (caso de que nom haja nengum)
        let autor = {
            id: data[i].idAutor,
            nome: data[i].nomeAutor
        };
        autores.push(autor); 
      }
    }
    console.log(autores)

    let generos = [];
    for (let i = 0; i < data.length; i++) {
      let gf = generos.find(g => g.id === data[i].idGenero); 
      if (!gf && data[i].idGenero) {      // Se nom o atopa e data[i].idGenero nom é null (caso de que nom haja nengum)
        var genero = {
            id: data[i].idGenero,
            nome: data[i].nomeGenero
        };
        generos.push(genero);
      }
    }
    console.log(generos)

    var livro = {
      id: String(data[0].idLivro),
      titulo: data[0].Titulo,
      autores: autores,
      tituloOriginal: data[0].TituloOriginal,
      generos: generos,
      idEditorial: data[0].idEditorial,
      idBiblioteca: data[0].idBiblioteca,
      biblioteca: data[0].biblioteca,
      idEditorial: data[0].idEditorial,
      editorial: data[0].editorial,
      idColecom: data[0].idColecom,
      colecom: data[0].colecom,
      idEstilo: data[0].idEstilo,
      estilo: data[0].estilo,
      isbn: data[0].ISBN,
      paginas: data[0].Paginas,
      paginasLidas: data[0].PaginasLidas,
      lido: data[0].Lido,
      diasLeitura: data[0].TempoLeitura,
      dataFimLeitura: data[0].DataFimLeitura,
      idIdioma: data[0].fkIdioma,
      idIdiomaOriginal: data[0].fkIdiomaOriginal,
      dataCriacom: data[0].DataCriacom,
      dataEdicom: data[0].DataEdicom,
      numeroEdicom: data[0].NumeroEdicom,
      electronico: data[0].Electronico,
      somSerie: data[0].SomSerie,
      idSerie: data[0].idSerie,
      premios: data[0].Premios,
      descricom: data[0].Descricom,
      comentario: data[0].Comentario,
      pontuacom: data[0].Pontuacom
    }
  }

  const meta = {'id': id};
  return {
    livro,
    meta
  }
}

async function postLivro(livro){
  console.log('Petiçom de postLivro ' + livro.titulo + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `
    INSERT INTO Livro
      (fkUsuario, Titulo, TituloOriginal, fkBiblioteca, fkEditorial, fkColecom, fkEstilo, ISBN, 
       Electronico, Paginas, PaginasLidas, Lido, TempoLeitura, DataFimLeitura, fkIdioma, fkIdiomaOriginal, DataCriacom, 
       DataEdicom, NumeroEdicom, Premios, Descricom, Comentario, Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie)
     VALUES
      (2, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, 3, ?, ?);`;

  const dadosInsert = [
    livro.titulo,
    db.stringOuNullSimple(livro.tituloOriginal),
    db.numberOuNull(livro.idBiblioteca),
    db.numberOuNull(livro.idEditorial),
    db.numberOuNull(livro.idColecom),
    db.numberOuNull(livro.idEstilo),
    db.stringOuNullSimple(livro.isbn),
    livro.electronico ? 1 : 0,

    db.numberOuNull(livro.paginas),
    db.numberOuNull(livro.paginasLidas),
    livro.lido ? 1 : 0,
    db.stringOuNullSimple(livro.diasLeitura),
    db.stringOuNullSimple(livro.dataFimLeitura),
    db.numberOuNull(livro.idIdioma),
    db.numberOuNull(livro.idIdiomaOriginal),
    db.stringOuNullSimple(livro.dataCriacom),
    db.stringOuNullSimple(livro.dataEdicom),

    db.numberOuNull(livro.numeroEdicom),
    db.stringOuNullSimple(livro.premios),
    db.stringOuNullSimple(livro.descricom),
    db.stringOuNullSimple(livro.comentario),
    db.numberOuNull(livro.pontuacom),
    livro.somSerie ? 1 : 0,
    db.numberOuNull(livro.idSerie)
  ];

  await db.query(queryInsert, dadosInsert)
    .then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = ResultSetHeader.insertId
      }
    );

  if (livro.autores.length > 0) {
    let qAutores = guardarAutores(livro.autores, '(SELECT MAX(idLivro) as idLivro FROM Livro)');
    await db.query(qAutores);
  }
  if (livro.generos.length > 0) {
    let qGeneros = guardarGeneros(livro.generos, '(SELECT MAX(idLivro) as idLivro FROM Livro)');
    await db.query(qGeneros);
  }
    
  console.log('id: ' + idResult + ' livro creado');
  
  return {
    idResult
  }
}

async function putLivro(livro){
  console.log('Petiçom de putLivro ' + livro.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  
  await borrarAutoresAsigandos(livro.id);
  if (livro.autores.length > 0) {
    let qAutores = guardarAutores(livro.autores, livro.id);
    await db.query(qAutores);
  }
  await borrarGenerosAsigandos(livro.id);
  if (livro.generos.length > 0) {
    let qGeneros = guardarGeneros(livro.generos, livro.id);
    console.log(qGeneros)
    await db.query(qGeneros);
  }
  
  const queryInsert = `UPDATE Livro SET
    Titulo = ?,
    TituloOriginal = ?,
    fkBiblioteca = ?,
    fkEditorial = ?,
    fkColecom = ?,
    fkEstilo = ?,
    ISBN = ?,
    Electronico = ?,
    Paginas = ?,
    PaginasLidas = ?,
    Lido = ?,
    TempoLeitura = ?,
    DataFimLeitura = ?,
    fkIdioma = ?,
    fkIdiomaOriginal = ?,
    DataCriacom = ?,
    DataEdicom = ?,
    NumeroEdicom = ?,
    Premios = ?,
    Descricom = ?,
    Comentario = ?,
    Pontuacom = ?,
    fkIdiomaDaEntrada = 3,
    SomSerie = ?,
    idSerie = ?
    WHERE idLivro = ?;`;

  const dadosInsert = [
    livro.titulo,
    db.stringOuNullSimple(livro.tituloOriginal),
    db.numberOuNull(livro.idBiblioteca),
    db.numberOuNull(livro.idEditorial),
    db.numberOuNull(livro.idColecom),
    db.numberOuNull(livro.idEstilo),
    db.stringOuNullSimple(livro.isbn),
    livro.electronico ? 1 : 0,
    db.numberOuNull(livro.paginas),
    db.numberOuNull(livro.paginasLidas),
    livro.lido ? 1 : 0,
    db.numberOuNull(livro.diasLeitura),
    db.stringOuNullSimple(livro.dataFimLeitura),
    db.numberOuNull(livro.idIdioma),
    db.numberOuNull(livro.idIdiomaOriginal),
    db.stringOuNullSimple(livro.dataCriacom),
    db.stringOuNullSimple(livro.dataEdicom),
    db.numberOuNull(livro.numeroEdicom),
    db.stringOuNullSimple(livro.premios),
    db.stringOuNullSimple(livro.descricom),
    db.stringOuNullSimple(livro.comentario),
    db.numberOuNull(livro.pontuacom),
    livro.somSerie ? 1 : 0,
    livro.idSerie,
    livro.id
  ];

  await db.query(queryInsert, dadosInsert).then(ResultSetHeader => {
      console.log(ResultSetHeader);
      if (ResultSetHeader.affectedRows == 1)
        idResult = livro.id;
    }
  );
  
  console.log('id: ' + idResult + ' livro actualizado');
  return {
    idResult
  }
}

async function borrarAutoresAsigandos(id) {  
  await db.query(`DELETE FROM Autores WHERE fkLivro = ${id};`);
  console.log('borrados autores');
}

async function borrarGenerosAsigandos(id) {  
  await db.query(`DELETE FROM Generos WHERE fkLivro = ${id};`);
  console.log('borrados generos');
}

function guardarAutores(autores, idLivro) {
  let queryInsert = '';
  autores.forEach(function (autor) {
    queryInsert += ', (2,' + idLivro + ',' + autor.id + ')';
  }); 
  if (queryInsert.length > 0) {
    queryInsert = 'INSERT INTO Autores(fkUsuario, fkLivro, fkAutor) VALUES' + queryInsert.substring(1) + '; ';
    console.log(queryInsert);
  }
  return queryInsert;
}

function guardarGeneros(generos, idLivro) {
  let queryInsert = '';
  generos.forEach(function (genero) {
    queryInsert += ', (2,' + idLivro + ',' + genero.id + ')';
  }); 
  if (queryInsert.length > 0) {
    queryInsert = 'INSERT INTO Generos(fkUsuario, fkLivro, fkGenero) VALUES' + queryInsert.substring(1) + '; ';
    console.log(queryInsert);
  }
  return queryInsert;
}

async function borrarLivro(id) {
  console.log('id para borrar: ' + id);
  let idResult = 0;

  borrarAutoresAsigandos(id);
  borrarGenerosAsigandos(id);

  await db.query(
    `DELETE FROM Livro WHERE idLivro = ${id};`
  ).then(ResultSetHeader => {
      if (ResultSetHeader.affectedRows == 1)
        idResult = id;
    }
  );

  console.log('id: ' + idResult + ' livro borrado');
  const meta = {'id': idResult};
  return {
    idResult,
    meta
  }
}

module.exports = {
  getLivros, getLivroPorTitulo, getLivrosUltimaLectura, getLivrosPorIdioma, getLivrosPorAno, getLivrosPorGenero, getLivrosPorEditorial, 
  getLivrosPorBiblioteca, getLivrosPorColecom, getLivrosPorEstiloLiterario, getLivrosPorAutor, 
  getLivro, postLivro, putLivro, borrarLivro
}
