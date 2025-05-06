const db = require('../utils/db');
const helper = require('../utils/helper');

async function getLivros(idUsuario){
  console.log('Petiçom de getLivros');
  let select = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal", l.Paginas as "paginas"
    , l.DataFimLeitura as "dataFimLeitura"
    , ar.idAutor as "idAutor", ar.Nome as "nomeAutor"
    , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
    , (SELECT COUNT(rr.idRelectura) FROM Relectura rr WHERE rr.fkLivro = l.idLivro) as "quantidadeRelecturas"
    FROM Livro l
    LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
    LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
    WHERE l.fkUsuario = ${idUsuario} 
    ORDER BY lower(l.titulo) ASC;`;
  const dados = await db.query(select);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': 0, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

const camposLivrosPorLxxx = `
    l.idLivro as "id", l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal", l.Paginas as "paginas"
    , l.DataFimLeitura as "dataFimLeitura"
    , l.fkIdioma as "idioma", i.Nome as "nomeIdioma", io.Nome as "idiomaOriginal"
    , l.Pontuacom AS "Pontuacom", l.lido, l.Electronico AS "Electronico"
    , ar.idAutor AS "idAutor", ar.Nome as "nomeAutor"
    , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
    , (SELECT COUNT(rr.idRelectura) FROM Relectura rr WHERE rr.fkLivro = l.idLivro) as "quantidadeRelecturas"
  `;
const camposLivrosPorRxxx = `
    l.idLivro as "id", r.Titulo as "titulo", l.TituloOriginal as "tituloOriginal", r.Paginas as "paginas"
    , r.DataFimLeitura as "dataFimLeitura"
    , r.fkIdioma as "idioma", i.Nome as "nomeIdioma", io.Nome as "idiomaOriginal"
    , r.Pontuacom AS "Pontuacom", r.lido, r.Electronico AS "Electronico"
    , ar.idAutor AS "idAutor", ar.Nome as "nomeAutor"
    , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
    , (SELECT COUNT(rr.idRelectura) FROM Relectura rr WHERE rr.fkLivro = l.idLivro) as "quantidadeRelecturas"
  `;

async function getLivrosParaListadoMovel(idUsuario){
  console.log('Petiçom de getLivros');
  let select = `SELECT ${camposLivrosPorLxxx}
    , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
    , (SELECT COUNT(rr.idRelectura) FROM Relectura rr WHERE rr.fkLivro = l.idLivro) as "quantidadeRelecturas"
    FROM Livro l
    LEFT JOIN Idioma i ON l.fkIdioma = i.idIdioma
    LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
    LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
    LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
    WHERE l.fkUsuario = ${idUsuario}
    ORDER BY lower(l.titulo) ASC;`;
  const dados = await db.query(select);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');

  const date = new Date();
  const dateFormatada = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/');

  const meta = {'id': 0, 'quantidade': data.length, 'data': dateFormatada};

  return {
    data,
    meta
  }
}

// Para evitar ter na BD dous co mesmo Titulo.
async function getLivroPorTitulo(idUsuario, titulo){
  console.log('Petiçom de getLivroPorTitulo ' + new Date().toJSON());
  const dadosLivro = await db.query(
    `SELECT l.idLivro as id
      FROM Livro l
      WHERE l.fkUsuario = ${idUsuario} AND l.Titulo like '%${titulo}%' ;`
  );
  
  const livro = helper.emptyOrRows(dadosLivro);
  console.log(livro.length + ' elementos devoltos');

  const meta = {'id': livro.length > 0 ? livro[0].id : 0, 'quantidade': livro.length};

  return {
    data: livro,
    meta
  }
}

async function getLivrosUltimaLectura(idUsuario){
  console.log('Petiçom de getLivrosUltimaLectura');
  const dados = await db.query(
    `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as tituloOriginal, l.DataFimLeitura as "dataFimLeitura"
    , ar.idAutor, ar.Nome as "nomeAutor"
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as quantidadeSerie
      FROM Livro l
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} AND l.Lido = true
      ORDER BY "dataFimLeitura" DESC;`
  );

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': 0, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorIdioma(idUsuario, idioma){
  console.log('Petiçom de getLivrosPorIdioma para o idioma: ' + idioma);
  let query = `SELECT uu.* FROM (
      SELECT ${camposLivrosPorLxxx}
        , '0' as "idRelectura", i.Nome as "nomeFiltro"
        FROM Livro l
        INNER JOIN Idioma i ON l.fkIdioma = i.idIdioma
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = ${idUsuario}
        AND i.idIdioma = ${idioma} AND l.Lido = true
    UNION ALL
      SELECT ${camposLivrosPorRxxx}
        , r.idRelectura as "idRelectura", i.Nome as "nomeFiltro"
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        INNER JOIN Idioma i ON r.fkIdioma = i.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = ${idUsuario}
        AND i.idIdioma = ${idioma} AND r.Lido = true
    ) AS uu`;
  query += process.env.QUAL_PROJECTO === 'render' ? 
      ' ORDER BY uu.titulo, lower(uu."nomeFiltro") ASC;' 
    : ' ORDER BY uu.titulo, lower(uu.nomeFiltro) ASC;' 
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Idioma': idioma};

  return {
    data,
    meta
  }
}

async function getLivrosPorAno(idUsuario, ano){
  console.log('Petiçom de getLivrosPorAno para o ano: ' + ano);
  let query = `SELECT uu.* FROM (
      SELECT ${camposLivrosPorLxxx}
        , '0' as "idRelectura", ${ano} as "nomeFiltro"
        FROM Livro l
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
        LEFT JOIN Idioma i ON l.fkIdioma = i.idIdioma
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        WHERE l.fkUsuario = ${idUsuario} 
        AND YEAR(l.DataFimLeitura) = ${ano} AND l.Lido = true
    UNION ALL
      SELECT ${camposLivrosPorRxxx}
        , r.idRelectura as "idRelectura", ${ano} as "nomeFiltro"
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
        LEFT JOIN Idioma i ON r.fkIdioma = i.idIdioma
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        WHERE r.fkUsuario = ${idUsuario} 
        AND YEAR(r.DataFimLeitura) = ${ano} AND r.Lido = true
    ) AS uu`;
  query += process.env.QUAL_PROJECTO === 'render' ? 
      ' ORDER BY uu."titulo" ASC;' 
    : ' ORDER BY uu.titulo ASC;' 
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Ano': ano};

  return {
    data,
    meta
  }
}

async function getLivrosPorGenero(idUsuario, genero){
  console.log('Petiçom de getLivrosPorGenero para o genero: ' + genero);
  let query = `SELECT uu.* FROM (
      SELECT ${camposLivrosPorLxxx}
        , '0' as "idRelectura", g.Nome as "nomeFiltro"
        FROM Livro l
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
        INNER JOIN Idioma i ON l.fkIdioma = i.idIdioma
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = ${idUsuario} 
        AND gs.fkGenero = ${genero} AND l.Lido = true
    UNION ALL
      SELECT ${camposLivrosPorRxxx}
        , r.idRelectura as "idRelectura", g.Nome as "nomeFiltro"
        FROM Relectura r
        LEFT JOIN Livro l ON r.fkLivro = l.idLivro 
        INNER JOIN Generos gs ON gs.fkLivro = l.idLivro
        INNER JOIN Genero g ON g.idGenero = gs.fkGenero
        INNER JOIN Idioma i ON r.fkIdioma = i.idIdioma
        LEFT JOIN Idioma io ON l.fkIdiomaOriginal = io.idIdioma
        LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
        LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor
        WHERE l.fkUsuario = ${idUsuario} 
        AND gs.fkGenero = ${genero} AND r.Lido = true
    ) AS uu`;
  query += process.env.QUAL_PROJECTO === 'render' ? 
      ' ORDER BY uu.titulo, lower(uu."nomeFiltro") ASC;' 
    : ' ORDER BY uu.titulo, lower(uu.nomeFiltro) ASC;' 
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'Genero': genero};

  return {
    data,
    meta
  }
}

async function getLivrosPorAutor(idUsuario, id){
  console.log('Petiçom de getLivrosPorAutor para o idAutor: ' + id);
  let query =
    `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal", l.DataFimLeitura as "dataFimLeitura"
      , l.lido
      , ar.idAutor as "idAutor", ar.Nome as "nomeAutor"
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
      FROM Livro l
      INNER JOIN Autores ars ON l.idLivro = ars.fkLivro 
      INNER JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} 
      AND ar.idAutor = ${id} 
      ORDER BY l.titulo ASC;`;
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorEditorial(idUsuario, id){
  console.log('Petiçom de getLivrosPorEditorial para o idEditorial: ' + id);
  let query = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal"
      , l.DataFimLeitura as "dataFimLeitura"
      , ar.idAutor, ar.Nome as "nomeAutor"      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
      FROM Livro l
      INNER JOIN Editorial e ON l.fkEditorial = e.idEditorial 
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} 
      AND e.idEditorial = ${id}
      ORDER BY l.titulo ASC;`;
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorBiblioteca(idUsuario, id){
  console.log('Petiçom de getLivrosPorBiblioteca para a idBiblioteca: ' + id);
  let query = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal"
      , l.DataFimLeitura as "dataFimLeitura"
      , ar.idAutor, ar.Nome as "nomeAutor"      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
      FROM Livro l
      INNER JOIN Biblioteca b ON l.fkBiblioteca = b.idBiblioteca
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} 
      AND b.idBiblioteca = ${id} 
      ORDER BY l.titulo ASC;`;
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorColecom(idUsuario, id){
  console.log('Petiçom de getLivrosPorColecom para a idColecom: ' + id);
  let query = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal"
      , l.DataFimLeitura as "dataFimLeitura"
      , ar.idAutor, ar.Nome as "nomeAutor"      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
      FROM Livro l
      INNER JOIN Colecom c ON l.fkColecom = c.idColecom
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} 
      AND c.idColecom = ${id} 
      ORDER BY l.titulo ASC;`;
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosPorEstiloLiterario(idUsuario, id){
  console.log('Petiçom de getLivrosPorEstiloLiterario para a idEstiloLiterario: ' + id);
  let query = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as "tituloOriginal"
      , l.DataFimLeitura as "dataFimLeitura"
      , ar.idAutor, ar.Nome as "nomeAutor"      
      , (SELECT COUNT(ll.idSerie) FROM Livro ll WHERE ll.idSerie = l.idLivro) as "quantidadeSerie"
      FROM Livro l
      INNER JOIN estiloLiterario e ON l.fkEstilo = e.idEstilo
      LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
      LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
      WHERE l.fkUsuario = ${idUsuario} 
      AND e.idEstilo = ${id}
      ORDER BY l.titulo ASC;`;
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
  console.log(data.length + ' elementos devoltos');
  const meta = {'id': id, 'quantidade': data.length};

  return {
    data,
    meta
  }
}

async function getLivrosSerie(idUsuario, id){
  console.log('Petiçom de getLivrosSerie para o idLivro: ' + id);
  let query = `SELECT l.idLivro as id, l.Titulo as "titulo", l.TituloOriginal as tituloOriginal, ar.idAutor, ar.Nome as "nomeAutor"
      FROM Livro l
      WHERE l.fkUsuario = ${idUsuario} 
      AND l.idSerie = ${id} `;
  query += process.env.QUAL_PROJECTO === 'render' ? 
      ' ORDER BY l.titulo, lower(ar."nomeAutor") ASC;'
    : ' ORDER BY l.titulo, lower(ar.nomeAutor) ASC;';
  const dados = await db.query(query);

  let data = helper.emptyOrRows(dados);
  data = LivroComMaisDumAutor(data);
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
function LivroComMaisDumAutor(data) {
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

async function getLivro(idUsuario, id){
  console.log('Petiçom de getLivro para o id: ' + id);
  let query = `SELECT
      l.idLivro AS "idLivro", l.Titulo AS "Titulo", l.TituloOriginal AS "TituloOriginal"
      , b.idBiblioteca AS "idBiblioteca", b.Nome as biblioteca
      , e.idEditorial AS "idEditorial", e.Nome as editorial
      , c.idColecom AS "idColecom", c.Nome as colecom
      , el.idEstilo, el.Nome as "estilo"
      , l.fkBiblioteca, l.fkEditorial, l.fkColecom, l.fkEstilo, l.ISBN AS "ISBN"
      , l.Paginas AS "Paginas", l.PaginasLidas AS "PaginasLidas", l.Lido AS "Lido", l.TempoLeitura AS "TempoLeitura"
      , DATE_FORMAT(l.DataFimLeitura,'%d/%m/%Y') as "DataFimLeitura"
      , l.fkIdioma AS "fkIdioma", l.fkIdiomaOriginal AS "fkIdiomaOriginal"
      , DATE_FORMAT(l.DataCriacom,'%d/%m/%Y') as "DataCriacom"
      , DATE_FORMAT(l.DataEdicom,'%d/%m/%Y') as "DataEdicom"
      , l.NumeroEdicom AS "NumeroEdicom", l.Electronico AS "Electronico"
      , l.SomSerie AS "SomSerie", l.idSerie AS "idSerie", l.Premios AS "Premios", l.Descricom AS "Descricom"
      , l.Comentario AS "Comentario", l.Pontuacom AS "Pontuacom"
      , ar.idAutor AS "idAutor", ar.Nome as "nomeAutor"
      , gn.idGenero AS "idGenero", gn.Nome as "nomeGenero"
    FROM Livro l
    LEFT JOIN Autores ars ON l.idLivro = ars.fkLivro 
    LEFT JOIN Autor ar ON ars.fkAutor = ar.idAutor  
    LEFT JOIN Generos gns ON l.idLivro = gns.fkLivro 
    LEFT JOIN Genero gn ON gns.fkGenero = gn.idGenero  
    LEFT JOIN Biblioteca b ON l.fkBiblioteca = b.idBiblioteca 
    LEFT JOIN Editorial e ON l.fkEditorial = e.idEditorial 
    LEFT JOIN Colecom c ON l.fkColecom = c.idColecom 
    LEFT JOIN EstiloLiterario el ON l.fkEstilo = el.idEstilo 
    WHERE l.idLivro = ${id} AND l.fkUsuario = ${idUsuario};`;
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

    var livro = [{
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
    }]
  }

  const meta = {'id': id};
  return {
    data: livro,
    meta
  }
}

async function postLivro(idUsuario, livro){
  console.log('Petiçom de postLivro ' + livro.titulo + ' data: ' + new Date().toJSON());
  let idResult = 0;
  const queryInsert = `
    INSERT INTO Livro
      (fkUsuario, Titulo, TituloOriginal, fkBiblioteca, fkEditorial, fkColecom, fkEstilo, ISBN, 
       Electronico, Paginas, PaginasLidas, Lido, TempoLeitura, DataFimLeitura, fkIdioma, fkIdiomaOriginal, DataCriacom, 
       DataEdicom, NumeroEdicom, Premios, Descricom, Comentario, Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie)
     VALUES
      (?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, 3, ?, ?);`;

  const dadosInsert = [
    idUsuario,
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
    let qAutores = guardarAutores(idUsuario, livro.autores, '(SELECT MAX(idLivro) as idLivro FROM Livro)');
    await db.query(qAutores);
  }
  if (livro.generos.length > 0) {
    let qGeneros = guardarGeneros(idUsuario, livro.generos, '(SELECT MAX(idLivro) as idLivro FROM Livro)');
    await db.query(qGeneros);
  }
    
  console.log('id: ' + idResult + ' livro creado');
  
  return {
    idResult
  }
}

async function putLivro(idUsuario, livro){
  console.log('Petiçom de putLivro ' + livro.id + ' data: ' + new Date().toJSON());
  let idResult = 0;
  
  await borrarAutoresAsigandos(idUsuario, livro.id);
  if (livro.autores.length > 0) {
    let qAutores = guardarAutores(idUsuario, livro.autores, livro.id);
    await db.query(qAutores);
  }
  await borrarGenerosAsigandos(idUsuario, livro.id);
  if (livro.generos.length > 0) {
    let qGeneros = guardarGeneros(idUsuario, livro.generos, livro.id);
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
    WHERE idLivro = ? AND fkUsuario = ?;`;

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
    livro.id,
    idUsuario
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

async function borrarAutoresAsigandos(idUsuario, id) {  
  await db.query(`DELETE FROM Autores WHERE fkLivro = ${id} AND fkUsuario = ${idUsuario};`);
  console.log('borrados autores');
}

async function borrarGenerosAsigandos(idUsuario, id) {  
  await db.query(`DELETE FROM Generos WHERE fkLivro = ${id} AND fkUsuario = ${idUsuario};`);
  console.log('borrados generos');
}

function guardarAutores(idUsuario, autores, idLivro) {
  let queryInsert = '';
  autores.forEach(function (autor) {
    queryInsert += `, (${idUsuario}, ${idLivro}, ${autor.id})`;
  }); 
  if (queryInsert.length > 0) {
    queryInsert = 'INSERT INTO Autores(fkUsuario, fkLivro, fkAutor) VALUES' + queryInsert.substring(1) + '; ';
    console.log(queryInsert);
  }
  return queryInsert;
}

function guardarGeneros(idUsuario, generos, idLivro) {
  let queryInsert = '';
  generos.forEach(function (genero) {
    queryInsert += `, (${idUsuario}, ${idLivro}, ${genero.id})`;
  }); 
  if (queryInsert.length > 0) {
    queryInsert = 'INSERT INTO Generos(fkUsuario, fkLivro, fkGenero) VALUES' + queryInsert.substring(1) + '; ';
    console.log(queryInsert);
  }
  return queryInsert;
}

async function borrarLivro(idUsuario, id) {
  console.log('id para borrar: ' + id);
  let idResult = 0;

  borrarAutoresAsigandos(idUsuario, id);
  borrarGenerosAsigandos(idUsuario, id);

  await db.query(
    `DELETE FROM Livro WHERE idLivro = ${id} AND fkUsuario = ${idUsuario};`
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
  getLivros, getLivrosParaListadoMovel: getLivrosParaListadoMovel, 
  getLivroPorTitulo, getLivrosUltimaLectura, getLivrosPorIdioma, getLivrosPorAno, getLivrosPorGenero, getLivrosPorEditorial, 
  getLivrosPorBiblioteca, getLivrosPorColecom, getLivrosPorEstiloLiterario, getLivrosPorAutor, 
  getLivro, postLivro, putLivro, borrarLivro
}
