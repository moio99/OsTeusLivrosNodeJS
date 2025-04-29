const db = require('../utils/db');
const helper = require('../utils/helper');

async function getNacionalidades(){
  console.log('Petiçom de getNacionalidades ' + new Date().toJSON());
  const dadosNacionalidades = await db.query(
    `SELECT n.idNacionalidade as id, n.Nome as nome
       , n.fkPais, p.Nome as nomePais, n.fkContinente, c.Nome as nomeContinente
      FROM Nacionalidade n
      LEFT JOIN Pais p ON n.fkPais = p.idPais
      LEFT JOIN Continente c ON n.fkContinente = c.idContinente
      ORDER BY lower(n.Nome) ASC;`
  );
  return getGenerico(dadosNacionalidades);
}

async function getNacionalidadeNome(id){
  console.log(`Petiçom de getNacionalidadeNome id: ${id} data: ${new Date().toJSON()}`);
  const dadosNacionalidade = await db.query(
    `SELECT n.Nome as nome
      FROM Nacionalidade n
      WHERE n.idNacionalidade = ${id} ;`
  );
  
  const nacionalidade = helper.emptyOrRows(dadosNacionalidade);
  if (nacionalidade) {
    console.log(`Nome ${nacionalidade[0].nome} obtido`);
    return nacionalidade[0].nome;
  }
  else
    return null;
}

async function getPaises(){
  console.log('Petiçom de getPaises ' + new Date().toJSON());
  const dadosPaises = await db.query(
    `SELECT p.idPais as id, p.Nome as nome, p.fkContinente, c.Nome as nomeContinente
      FROM Pais p
      LEFT JOIN Continente c ON p.fkContinente = c.idContinente
      ORDER BY lower(p.Nome) ASC;`
  );
  return getGenerico(dadosPaises);
}

async function getPaisNome(id){
  console.log(`Petiçom de getPaisNome id: ${id} data: ${new Date().toJSON()}`);
  const dadosPais = await db.query(
    `SELECT p.Nome as nome
      FROM Pais p
      WHERE p.idPais = ${id} ;`
  );
  
  const pais = helper.emptyOrRows(dadosPais);
  if (pais) {
    console.log(`Nome ${pais[0].nome} obtido`);
    return pais[0].nome;
  }
  else
    return null;
}

async function getAutores(idUsuario){
  console.log('Petiçom de getAutores ' + new Date().toJSON());
  const dadosAutores = await db.query(
    `SELECT a.idAutor id, a.Nome as nome, a.Comentario as comentario
      FROM Autor a
      WHERE a.fkUsuario = ${idUsuario}
      ORDER BY lower(a.Nome) ASC;`
  );
  
  return getGenerico(dadosAutores);
}

async function getBibliotecas(idUsuario){
  console.log('Petiçom de getBibliotecas ' + new Date().toJSON());
  const dadosBibliotecas = await db.query(
    `SELECT b.idBiblioteca as id, b.Nome as nome, b.Endereco as endereco, b.Localidade as localidade
        , b.Telefone as telefone, b.DataAsociamento as dataAsociamento
        , b.DataRenovacom as dataRenovacom, b.Comentario as comentario
      FROM Biblioteca b
      WHERE b.fkUsuario = ${idUsuario}
      ORDER BY lower(b.Nome) ASC;`
  );
  
  return getGenerico(dadosBibliotecas);
}

async function getEditoriais(idUsuario){
  console.log('Petiçom de getEditoriais ' + new Date().toJSON());
  const dadosEditoriais = await db.query(
    `SELECT e.idEditorial id, e.Nome as nome, e.Direicom as direicom, e.web
        , e.Comentario as comentario
      FROM Editorial e
      WHERE e.fkUsuario = ${idUsuario}
      ORDER BY lower(e.Nome) ASC;`
  );
  
  return getGenerico(dadosEditoriais);
}

async function getGeneros(idUsuario){
  console.log('Petiçom de getGeneros ' + new Date().toJSON());
  const dadosGeneros = await db.query(
    `SELECT g.idGenero id, g.Nome as nome, g.Comentario as comentario
      FROM Genero g
      WHERE g.fkUsuario = ${idUsuario}
      ORDER BY lower(g.Nome) ASC;`
  );
  
  return getGenerico(dadosGeneros);
}

async function getColecons(idUsuario){
  console.log('Petiçom de getColecons ' + new Date().toJSON());
  const dadosColecons = await db.query(
    `SELECT c.idColecom id, c.Nome as nome, c.ISBN, c.web, c.Comentario as comentario
      FROM Colecom c
      WHERE c.fkUsuario = ${idUsuario}
      ORDER BY lower(c.Nome) ASC;`
  );
  
  return getGenerico(dadosColecons);
}

async function getEstilosLiterarios(idUsuario){
  console.log('Petiçom de getEstilosLiterarios ' + new Date().toJSON());
  const dadosEstilos = await db.query(
    `SELECT e.idEstilo id, e.Nome as nome, e.Comentario as comentario
      FROM EstiloLiterario e
      WHERE e.fkUsuario = ${idUsuario}
      ORDER BY lower(e.Nome) ASC;`
  );
  
  return getGenerico(dadosEstilos);
}

async function getIdiomas(){
  console.log('Petiçom de getIdiomas ' + new Date().toJSON());
  const dados = await db.query(
    `SELECT i.idIdioma id, i.Nome as nome, i.Codigo as codigo
      FROM Idioma i
      ORDER BY lower(i.Nome) ASC;`
  );
  
  return getGenerico(dados);
}

async function getIdiomaNome(id){
  console.log(`Petiçom de getIdiomaNome id: ${id} data: ${new Date().toJSON()}`);
  const dadosIdioma = await db.query(
    `SELECT i.Nome as nome
      FROM Idioma i
      WHERE i.idIdioma = ${id} ;`
  );
  
  const idioma = helper.emptyOrRows(dadosIdioma);
  if (idioma) {
    console.log(`Nome ${idioma[0].nome} obtido`);
    return idioma[0].nome;
  }
  else
    return null;
}

async function getSeriesLivro(idUsuario){
  console.log('Petiçom de getSeriesLivro ' + new Date().toJSON());
  const dados = await db.query(
    `SELECT l.idLivro id, l.Titulo as titulo
      FROM Livro l
      WHERE l.fkUsuario = ${idUsuario} AND l.SomSerie = true AND l.idSerie = 0
      ORDER BY lower(l.Titulo) ASC;`
  );
  
  return getGenerico(dados);
}

async function getUltimaLeitura(idUsuario){
  console.log('Petiçom de getUltimaLeitura ' + new Date().toJSON());
  const dados = await db.query(
    /*
    *****************************************************
    TODO: Este MAX nom funciona
    *****************************************************
    */
    `SELECT MAX(l.DataFimLeitura) as ultimaLeitura
      FROM Livro l
      WHERE l.fkUsuario = ${idUsuario}`
  );
  
  const data = helper.emptyOrRows(dados);
  if (data.length > 0)
    return data[0].ultimaLeitura;
  else
    return '';
}


async function getUltimasLeituras(idUsuario){
  console.log('Petiçom de getUltimasLeituras ' + new Date().toJSON());
  const condicomTempo = process.env.QUAL_PROJECTO === 'render' ?
      `AND (
        EXTRACT(YEAR FROM l.DataFimLeitura) = EXTRACT(YEAR FROM CURRENT_DATE)
        OR 
        EXTRACT(YEAR FROM l.DataFimLeitura) = EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '1 year'))
        )`
    : `AND (YEAR(l.DataFimLeitura) = YEAR(CURDATE()) 
          OR YEAR(l.DataFimLeitura) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR)))`;
  const ultimasLeituras = await db.query(
    `SELECT uu.dataDoLivro, uu.id
      FROM (
        SELECT l.DataFimLeitura as dataDoLivro, l.idLivro as id
          FROM Livro l
          WHERE l.fkUsuario = ${idUsuario}
          ${condicomTempo}
        UNION ALL
        SELECT r.DataFimLeitura as dataDoLivro, r.idRelectura as id
          FROM Relectura r
          WHERE r.fkUsuario = ${idUsuario}
          ${condicomTempo.replaceAll('l.', 'r.')}
      ) AS uu`
  );
  
  return helper.emptyOrRows(ultimasLeituras);
}

async function getTodo(idUsuario) {
  console.log('Petiçom de getTodo ' + new Date().toJSON());
  const nacionalidades = await getNacionalidades();
  const paises = await getPaises();
  const autores = await getAutores(idUsuario);
  const bibliotecas = await getBibliotecas(idUsuario);
  const editoriais = await getEditoriais(idUsuario);
  const generos = await getGeneros(idUsuario);
  const colecons = await getColecons(idUsuario);
  const estilos = await getEstilosLiterarios(idUsuario);
  const idiomas = await getIdiomas();
  const seriesLivro = await getSeriesLivro(idUsuario);
  const ultimaLeitura = await getUltimaLeitura(idUsuario);
  const ultimasLeituras = await getUltimasLeituras(idUsuario);
  console.log('ultimaLeitura ' + ultimaLeitura);
  
  return {
    nacionalidades: nacionalidades,
    paises: paises,
    autores: autores,
    bibliotecas: bibliotecas,
    editoriais: editoriais,
    generos: generos,
    colecons: colecons,
    estilos: estilos,
    idiomas: idiomas,
    seriesLivro: seriesLivro,
    ultimaLeitura: ultimaLeitura,
    ultimasLeituras: ultimasLeituras
  }
}

async function getGenerico(datos){
  const data = helper.emptyOrRows(datos);
  console.log(data.length + ' elementos devoltos');

  const meta = {'quantidade': data.length};

  return {
    data,
    meta
  }
}

module.exports = {
  getNacionalidades, getNacionalidadeNome, getPaises, getPaisNome, getAutores, getBibliotecas, getEditoriais
  , getGeneros, getColecons, getIdiomas, getIdiomaNome, getSeriesLivro, getTodo
}
