import db from '../utils/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
}

function getFilenamePrefix() {
  return `bd-${new Date().toISOString().slice(0, 10)}`;
}

async function salvarDadosSQL(nomeBD = getFilenamePrefix()) {
  console.log('Petiçom de salvarDadosSQL ' + new Date().toJSON());

  const nomePasta = getFilenamePrefix();
  const caminhoDados = path.join(__dirname, '../data/' + nomePasta);
  const arquivoContinente = path.join(caminhoDados, `Continente.txt`);
  const arquivoPais = path.join(caminhoDados, `Pais.txt`);
  const arquivoIdiomas = path.join(caminhoDados, `Idiomas.txt`);
  const arquivoNacionalidades = path.join(caminhoDados, `Nacionalidades.txt`);
  const arquivoUsuarios = path.join(caminhoDados, `Usuarios.txt`);
  const arquivoAutores = path.join(caminhoDados, `Autores.txt`);
  const arquivoBibliotecas = path.join(caminhoDados, `Bibliotecas.txt`);
  const arquivoColecons = path.join(caminhoDados, `Colecons.txt`);
  const arquivoEditoriais = path.join(caminhoDados, `Editoriais.txt`);
  const arquivoGeneros = path.join(caminhoDados, `Generos.txt`);
  const arquivoLivros = path.join(caminhoDados, `Livros.txt`);
  const arquivoRelecturas = path.join(caminhoDados, `Relecturas.txt`);
  const arquivoAutoresR = path.join(caminhoDados, `AutoresR.txt`);
  const arquivoGenerosR = path.join(caminhoDados, `GenerosR.txt`);
  const arquivoEstilosLiterarios = path.join(caminhoDados, `EstilosLiterarios.txt`);

  try {
    const continentes = await db.query(
      'SELECT idContinente AS idContinente, Nome AS Nome FROM Continente;'
    );
    const paises = await db.query(
      'SELECT idPais AS idPais, Nome AS Nome, fkContinente AS fkContinente FROM Pais;'
    );
    const idiomas = await db.query(
      'SELECT idIdioma AS idIdioma, Nome AS Nome, Codigo AS Codigo FROM Idioma;'
    );
    const nacionalidades = await db.query(
      'SELECT idNacionalidade AS idNacionalidade, Nome AS Nome, fkPais AS fkPais, fkContinente AS fkContinente FROM Nacionalidade;'
    );
    const usuarios = await db.query(
      'SELECT idUsuario AS idUsuario, Nome AS Nome, pass AS pass, Pergunta AS Pergunta, Contestacom AS Contestacom, Correio AS Correio, fkIdioma AS fkIdioma, Ativado AS Ativado FROM Usuario;'
    );
    const autores = await db.query(
      `SELECT idAutor, fkUsuario, Nome, NomeReal, fkNacionalidade, fkPais, LugarNacemento, DATE_FORMAT(DataNacemento,'%Y-%m-%d') AS DataNacemento, DATE_FORMAT(DataDefuncom, '%Y-%m-%d') AS DataDefuncom, Premios, web, Comentario FROM Autor;`
    );
    const bibliotecas = await db.query(
      `SELECT idBiblioteca, fkUsuario, Nome, Endereco, Localidade, Telefone, DATE_FORMAT(DataAsociamento, '%Y-%m-%d') AS DataAsociamento, DATE_FORMAT(DataRenovacom, '%Y-%m-%d') AS DataRenovacom, Comentario FROM Biblioteca;`
    );
    const colecons = await db.query(
      'SELECT idColecom, fkUsuario, Nome, ISBN, web, Comentario FROM Colecom;'
    );
    const editoriais = await db.query(
      'SELECT idEditorial, fkUsuario, Nome, Direicom, web, Comentario FROM Editorial;'
    );
    const generos = await db.query(
      'SELECT idGenero, fkUsuario, Nome, Comentario FROM Genero;'
    );
    const livros = await db.query(
      `SELECT idLivro, fkUsuario, Titulo, TituloOriginal, fkGenero, fkSubGenero, fkBiblioteca, fkEditorial, fkColecom, ISBN, Electronico, Paginas, PaginasLidas, Lido, TempoLeitura, DATE_FORMAT(DataFimLeitura,'%Y-%m-%d') AS DataFimLeitura, fkIdioma, fkIdiomaOriginal, DATE_FORMAT(DataCriacom, '%Y-%m-%d') AS DataCriacom, DATE_FORMAT(DataEdicom, '%Y-%m-%d') AS DataEdicom, NumeroEdicom, Premios, Descricom, Comentario, Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie, fkEstilo FROM Livro;`
    )
    const relecturas = await db.query(
      `SELECT idRelectura, fkLivro, fkUsuario, Titulo, fkBiblioteca, fkEditorial, fkColecom, ISBN, Electronico, Paginas, PaginasLidas, Lido, TempoLeitura, DATE_FORMAT(DataFimLeitura,'%Y-%m-%d') AS DataFimLeitura, fkIdioma, DATE_FORMAT(DataEdicom, '%Y-%m-%d') AS DataEdicom, NumeroEdicom, Comentario, Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie FROM Relectura;`
    )
    const autoresR = await db.query(
      'SELECT idAutores, fkUsuario, fkLivro, fkAutor FROM Autores;'
    );
    const generosR = await db.query(
      'SELECT idGeneros, fkUsuario, fkLivro, fkGenero FROM Generos;'
    );
    const estilosLiterarios = await db.query(
      'SELECT idEstilo, fkUsuario, Nome, Comentario FROM EstiloLiterario;'
    );

    const linhasContinente = (continentes || []).map((continente) => {
      // o ?? está por se o C maiúsculo dá problemas, nesse caso usaria continente.idcontinente
      return `INSERT INTO \`${nomeBD }\`.\`Continente\` (\`idContinente\`,\`Nome\`) VALUES (${escapeSqlValue(continente.idContinente ?? continente.idcontinente)}, ${escapeSqlValue(continente.Nome ?? continente.nome)});`;
    });
    const linhasPais = (paises || []).map((pais) => {
      return `INSERT INTO \`${nomeBD }\`.\`Pais\` (\`idPais\`,\`Nome\`,\`fkContinente\`) VALUES (${escapeSqlValue(pais.idPais ?? pais.idpais)}, ${escapeSqlValue(pais.Nome ?? pais.nome)}, ${escapeSqlValue(pais.fkContinente ?? pais.fkcontinente)});`;
    });
    const linhasIdiomas = (idiomas || []).map((idioma) => {
      return `INSERT INTO \`${nomeBD }\`.\`Idioma\` (\`idIdioma\`,\`Nome\`,\`Codigo\`) VALUES (${escapeSqlValue(idioma.idIdioma ?? idioma.idIdioma)}, ${escapeSqlValue(idioma.Nome ?? idioma.nome)}, ${escapeSqlValue(idioma.Codigo ?? idioma.codigo)});`;
    });
    const linhasNacionalidades = (nacionalidades || []).map((nacionalidade) => {
      return `INSERT INTO \`${nomeBD }\`.\`Nacionalidade\` (\`idNacionalidade\`,\`Nome\`,\`fkPais\`,\`fkContinente\`) VALUES (${escapeSqlValue(nacionalidade.idNacionalidade ?? nacionalidade.idnacionalidade)}, ${escapeSqlValue(nacionalidade.Nome ?? nacionalidade.nome)}, ${escapeSqlValue(nacionalidade.fkPais ?? nacionalidade.fkpais)}, ${escapeSqlValue(nacionalidade.fkContinente ?? nacionalidade.fkcontinente)});`;
    });
    const linhasUsuarios = (usuarios || []).map((usuario) => {
      return `INSERT INTO \`${nomeBD }\`.\`Usuario\` (\`idUsuario\`,\`Nome\`,\`pass\`,\`Pergunta\`,\`Contestacom\`,\`Correio\`,\`fkIdioma\`,\`Ativado\`) VALUES (
  ${escapeSqlValue(usuario.idUsuario ?? usuario.idusuario)}
, ${escapeSqlValue(usuario.Nome ?? usuario.nome)}
, ${escapeSqlValue(usuario.pass ?? usuario.pass)}
, ${escapeSqlValue(usuario.Pergunta ?? usuario.pergunta)}
, ${escapeSqlValue(usuario.Contestacom ?? usuario.contestacom)}
, ${escapeSqlValue(usuario.Correio ?? usuario.correio)}
, ${escapeSqlValue(usuario.fkIdioma ?? usuario.fkidioma)}
, ${escapeSqlValue(usuario.Ativado ?? usuario.ativado)}
);`;});
    const linhasAutores = (autores || []).map((autor) => {
      return `INSERT INTO \`${nomeBD }\`.\`Autor\` (\`idAutor\`, \`fkUsuario\`, \`Nome\`, \`NomeReal\`, \`fkNacionalidade\`, \`fkPais\`, \`LugarNacemento\`, \`DataNacemento\`, \`DataDefuncom\`, \`Premios\`, \`web\`, \`Comentario\`) VALUES (
  ${escapeSqlValue(autor.idAutor ?? autor.idautor)}
, ${escapeSqlValue(autor.fkUsuario ?? autor.fkusuario)}
, ${escapeSqlValue(autor.Nome ?? autor.nome)}
, ${escapeSqlValue(autor.NomeReal ?? autor.nomereal)}
, ${escapeSqlValue(autor.fkNacionalidade ?? autor.fknacionalidade)}
, ${escapeSqlValue(autor.fkPais ?? autor.fkpais)}
, ${escapeSqlValue(autor.LugarNacemento ?? autor.lugarnacemento)}
, ${escapeSqlValue(autor.DataNacemento ?? autor.datanacemento)}
, ${escapeSqlValue(autor.DataDefuncom ?? autor.datadefuncom)}
, ${escapeSqlValue(autor.Premios ?? autor.premios)}
, ${escapeSqlValue(autor.web ?? autor.web)}
, ${escapeSqlValue(autor.Comentario ?? autor.comentario)}
);`;});
    const linhasBibliotecas = (bibliotecas || []).map((biblioteca) => {
      return `INSERT INTO \`${nomeBD }\`.\`Biblioteca\` (\`idBiblioteca\`, \`fkUsuario\`, \`Nome\`, \`Endereco\`, \`Localidade\`, \`Telefone\`, \`DataAsociamento\`, \`DataRenovacom\`, \`Comentario\`) VALUES (
  ${escapeSqlValue(biblioteca.idBiblioteca ?? biblioteca.idbiblioteca)}
, ${escapeSqlValue(biblioteca.fkUsuario ?? biblioteca.fkusuario)}
, ${escapeSqlValue(biblioteca.Nome ?? biblioteca.nome)}
, ${escapeSqlValue(biblioteca.Endereco ?? biblioteca.endereco)}
, ${escapeSqlValue(biblioteca.Localidade ?? biblioteca.localidade)}
, ${escapeSqlValue(biblioteca.Telefone ?? biblioteca.telefone)}
, ${escapeSqlValue(biblioteca.DataAsociamento ?? biblioteca.dataasociamento)}
, ${escapeSqlValue(biblioteca.DataRenovacom ?? biblioteca.datarenovacom)}
, ${escapeSqlValue(biblioteca.Comentario ?? biblioteca.comentario)}
);`;});
    const linhasColecons = (colecons || []).map((colecom) => {
      return `INSERT INTO \`${nomeBD }\`.\`Colecom\` (\`idColecom\`, \`fkUsuario\`, \`Nome\`, \`ISBN\`, \`web\`, \`Comentario\`) VALUES (
  ${escapeSqlValue(colecom.idColecom ?? colecom.idcolecom)}
, ${escapeSqlValue(colecom.fkUsuario ?? colecom.fkusuario)}
, ${escapeSqlValue(colecom.Nome ?? colecom.nome)}
, ${escapeSqlValue(colecom.ISBN ?? colecom.isbn)}
, ${escapeSqlValue(colecom.web ?? colecom.web)}
, ${escapeSqlValue(colecom.Comentario ?? colecom.comentario)}
);`;});
    const linhasEditoriais = (editoriais || []).map((editorial) => {
      return `INSERT INTO \`${nomeBD }\`.\`Editorial\` (\`idEditorial\`, \`fkUsuario\`, \`Nome\`, \`Direicom\`, \`web\`, \`Comentario\`) VALUES (
  ${escapeSqlValue(editorial.idEditorial ?? editorial.ideditorial)}
, ${escapeSqlValue(editorial.fkUsuario ?? editorial.fkusuario)}
, ${escapeSqlValue(editorial.Nome ?? editorial.nome)}
, ${escapeSqlValue(editorial.Direicom ?? editorial.direicom)}
, ${escapeSqlValue(editorial.web ?? editorial.web)}
, ${escapeSqlValue(editorial.Comentario ?? editorial.comentario)}
);`;});
    const linhasGeneros = (generos || []).map((genero) => {
      return `INSERT INTO \`${nomeBD }\`.\`Genero\` (\`idGenero\`, \`fkUsuario\`, \`Nome\`, \`Comentario\`) VALUES (
  ${escapeSqlValue(genero.idGenero ?? genero.idgenero)}
, ${escapeSqlValue(genero.fkUsuario ?? genero.fkusuario)}
, ${escapeSqlValue(genero.Nome ?? genero.nome)}
, ${escapeSqlValue(genero.Comentario ?? genero.comentario)}
);`;});
    const linhasLivros = (livros || []).map((livro) => {
      return `INSERT INTO \`${nomeBD }\`.\`Livro\` (\`idLivro\`, \`fkUsuario\`, \`Titulo\`, \`TituloOriginal\`, \`fkGenero\`, \`fkSubGenero\`, \`fkBiblioteca\`, \`fkEditorial\`, \`fkColecom\`, \`ISBN\`, \`Electronico\`, \`Paginas\`, \`PaginasLidas\`, \`Lido\`, \`TempoLeitura\`, \`DataFimLeitura\`, \`fkIdioma\`, \`fkIdiomaOriginal\`, \`DataCriacom\`, \`DataEdicom\`, \`NumeroEdicom\`, \`Premios\`, \`Descricom\`, \`Comentario\`, \`Pontuacom\`, \`fkIdiomaDaEntrada\`, \`SomSerie\`, \`idSerie\`, \`fkEstilo\`) VALUES (
  ${escapeSqlValue(livro.idLivro ?? livro.idlivro)}
, ${escapeSqlValue(livro.fkUsuario ?? livro.fkusuario)}
, ${escapeSqlValue(livro.Titulo ?? livro.titulo)}
, ${escapeSqlValue(livro.TituloOriginal ?? livro.titulooriginal)}
, ${escapeSqlValue(livro.fkGenero ?? livro.fkgenero)}
, ${escapeSqlValue(livro.fkSubGenero ?? livro.fksubgenero)}
, ${escapeSqlValue(livro.fkBiblioteca ?? livro.fkbiblioteca)}
, ${escapeSqlValue(livro.fkEditorial ?? livro.fkeditorial)}
, ${escapeSqlValue(livro.fkColecom ?? livro.fkcolecom)}
, ${escapeSqlValue(livro.ISBN ?? livro.isbn)}
, ${escapeSqlValue(livro.Electronico ?? livro.electronico)}
, ${escapeSqlValue(livro.Paginas ?? livro.paginas)}
, ${escapeSqlValue(livro.PaginasLidas ?? livro.paginaslidas)}
, ${escapeSqlValue(livro.Lido ?? livro.lido)}
, ${escapeSqlValue(livro.TempoLeitura ?? livro.tempoleitura)}
, ${escapeSqlValue(livro.DataFimLeitura ?? livro.datafimleitura)}
, ${escapeSqlValue(livro.fkIdioma ?? livro.fkidio)}
, ${escapeSqlValue(livro.fkIdiomaOriginal ?? livro.fkidiooriginal)}
, ${escapeSqlValue(livro.DataCriacom ?? livro.datacriacom)}
, ${escapeSqlValue(livro.DataEdicom ?? livro.dataedicom)}
, ${escapeSqlValue(livro.NumeroEdicom ?? livro.numeroedicom)}
, ${escapeSqlValue(livro.Premios ?? livro.premios)}
, ${escapeSqlValue(livro.Descricom ?? livro.descricom)}
, ${escapeSqlValue(livro.Comentario ?? livro.comentario)}
, ${escapeSqlValue(livro.Pontuacom ?? livro.pontuacom)}
, ${escapeSqlValue(livro.fkIdiomaDaEntrada ?? livro.fkidioentrada)}
, ${escapeSqlValue(livro.SomSerie ?? livro.somserie)}
, ${escapeSqlValue(livro.idSerie ?? livro.idserie)}
, ${escapeSqlValue(livro.fkEstilo ?? livro.fkestilo)}
);`;});
    const linhasRelecturas = (relecturas || []).map((relectura) => {
      return `INSERT INTO \`${nomeBD }\`.\`Relectura\` (\`idRelectura\`, \`fkLivro\`, \`fkUsuario\`, \`Titulo\`, \`fkBiblioteca\`, \`fkEditorial\`, \`fkColecom\`, \`ISBN\`, \`Electronico\`, \`Paginas\`, \`PaginasLidas\`, \`Lido\`, \`TempoLeitura\`, \`DataFimLeitura\`, \`fkIdioma\`, \`DataEdicom\`, \`NumeroEdicom\`, \`Comentario\`, \`Pontuacom\`, \`fkIdiomaDaEntrada\`, \`SomSerie\`, \`idSerie\`) VALUES (
  ${escapeSqlValue(relectura.idRelectura ?? relectura.idrelectura)}
, ${escapeSqlValue(relectura.fkLivro ?? relectura.fklivro)}
, ${escapeSqlValue(relectura.fkUsuario ?? relectura.fkusuario)}
, ${escapeSqlValue(relectura.Titulo ?? relectura.titulo)}
, ${escapeSqlValue(relectura.fkBiblioteca ?? relectura.fkbiblioteca)}
, ${escapeSqlValue(relectura.fkEditorial ?? relectura.fkeditorial)}
, ${escapeSqlValue(relectura.fkColecom ?? relectura.fkcolecom)}
, ${escapeSqlValue(relectura.ISBN ?? relectura.isbn)}
, ${escapeSqlValue(relectura.Electronico ?? relectura.electronico)}
, ${escapeSqlValue(relectura.Paginas ?? relectura.paginas)}
, ${escapeSqlValue(relectura.PaginasLidas ?? relectura.paginaslidas)}
, ${escapeSqlValue(relectura.Lido ?? relectura.lido)}
, ${escapeSqlValue(relectura.TempoLeitura ?? relectura.tempoleitura)}
, ${escapeSqlValue(relectura.DataFimLeitura ?? relectura.datafimleitura)}
, ${escapeSqlValue(relectura.fkIdioma ?? relectura.fkidio)}
, ${escapeSqlValue(relectura.DataEdicom ?? relectura.dataedicom)}
, ${escapeSqlValue(relectura.NumeroEdicom ?? relectura.numeroedicom)}
, ${escapeSqlValue(relectura.Comentario ?? relectura.comentario)}
, ${escapeSqlValue(relectura.Pontuacom ?? relectura.pontuacom)}
, ${escapeSqlValue(relectura.fkIdiomaDaEntrada ?? relectura.fkidioentrada)}
, ${escapeSqlValue(relectura.SomSerie ?? relectura.somserie)}
, ${escapeSqlValue(relectura.idSerie ?? relectura.idserie)}
);`;});
    const linhasAutoresR = (autoresR || []).map((autorR) => {
      return `INSERT INTO \`${nomeBD }\`.\`Autores\` (\`idAutores\`,\`fkUsuario\`,\`fkLivro\`,\`fkAutor\`) VALUES (
  ${escapeSqlValue(autorR.idAutores ?? autorR.idautores)}
, ${escapeSqlValue(autorR.fkUsuario ?? autorR.fkusuario)}
, ${escapeSqlValue(autorR.fkLivro ?? autorR.fklivro)}
, ${escapeSqlValue(autorR.fkAutor ?? autorR.fkautor)}
);`;});
    const linhasGenerosR = (generosR || []).map((generoR) => {
      return `INSERT INTO \`${nomeBD }\`.\`Generos\` (\`idGeneros\`,\`fkUsuario\`,\`fkLivro\`,\`fkGenero\`) VALUES (
  ${escapeSqlValue(generoR.idGeneros ?? generoR.idgeneros)}
, ${escapeSqlValue(generoR.fkUsuario ?? generoR.fkusuario)}
, ${escapeSqlValue(generoR.fkLivro ?? generoR.fklivro)}
, ${escapeSqlValue(generoR.fkGenero ?? generoR.fkgenero)}
);`;});
    const linhasEstilosLiterarios = (estilosLiterarios || []).map((estiloLiterario) => {
      return `INSERT INTO \`${nomeBD }\`.\`EstiloLiterario\` (\`idEstilo\`,\`fkUsuario\`,\`Nome\`,\`Comentario\`) VALUES (
  ${escapeSqlValue(estiloLiterario.idEstilo ?? estiloLiterario.idestiloLiterario)}
, ${escapeSqlValue(estiloLiterario.fkUsuario ?? estiloLiterario.fkusuario)}
, ${escapeSqlValue(estiloLiterario.Nome ?? estiloLiterario.nome)}
, ${escapeSqlValue(estiloLiterario.Comentario ?? estiloLiterario.comentario)}
);`;});

    await fs.mkdir(caminhoDados, { recursive: true });
    await fs.writeFile(arquivoContinente, linhasContinente.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoPais, linhasPais.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoIdiomas, linhasIdiomas.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoNacionalidades, linhasNacionalidades.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoUsuarios, linhasUsuarios.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoAutores, linhasAutores.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoBibliotecas, linhasBibliotecas.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoColecons, linhasColecons.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoEditoriais, linhasEditoriais.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoGeneros, linhasGeneros.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoLivros, linhasLivros.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoRelecturas, linhasRelecturas.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoAutoresR, linhasAutoresR.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoGenerosR, linhasGenerosR.join('\n') + '\n', 'utf8');
    await fs.writeFile(arquivoEstilosLiterarios, linhasEstilosLiterarios.join('\n') + '\n', 'utf8');

    console.log(`☑️ Exportados ${linhasContinente.length} continentes a ${arquivoContinente} 💾`);
    console.log(`☑️ Exportados ${linhasPais.length} paises a ${arquivoPais} 💾`);
    console.log(`☑️ Exportados ${linhasIdiomas.length} idiomas a ${arquivoIdiomas} 💾`);
    console.log(`☑️ Exportados ${linhasNacionalidades.length} nacionalidades a ${arquivoNacionalidades} 💾`);
    console.log(`☑️ Exportados ${linhasUsuarios.length} usuarios a ${arquivoUsuarios} 💾`);
    console.log(`☑️ Exportados ${linhasAutores.length} autores a ${arquivoAutores} 💾`);
    console.log(`☑️ Exportados ${linhasBibliotecas.length} bibliotecas a ${arquivoBibliotecas} 💾`);
	  console.log(`☑️ Exportados ${linhasColecons.length} colecons a ${arquivoColecons} 💾`);
    console.log(`☑️ Exportados ${linhasEditoriais.length} editoriais a ${arquivoEditoriais} 💾`);
    console.log(`☑️ Exportados ${linhasGeneros.length} generos a ${arquivoGeneros} 💾`);
    console.log(`☑️ Exportados ${linhasLivros.length} livros a ${arquivoLivros} 💾`);
    console.log(`☑️ Exportados ${linhasRelecturas.length} relecturas a ${arquivoRelecturas} 💾`);
    console.log(`☑️ Exportados ${linhasAutoresR.length} autores a ${arquivoAutoresR} 💾`);
    console.log(`☑️ Exportados ${linhasGenerosR.length} generos a ${arquivoGenerosR} 💾`);
    console.log(`☑️ Exportados ${linhasEstilosLiterarios.length} estilos literarios a ${arquivoEstilosLiterarios} 💾`);

    return {
      arquivoContinente,
      arquivoPais,
      arquivoIdiomas,
      arquivoNacionalidades,
      arquivoUsuarios,
      arquivoAutores,
      arquivoBibliotecas,
      arquivoColecons,
      arquivoEditoriais,
      arquivoGeneros,
      arquivoLivros,
      arquivoRelecturas,
      arquivoAutoresR,
      arquivoGenerosR,
      arquivoEstilosLiterarios,
      registrosContinente: linhasContinente.length,
      registrosPais: linhasPais.length,
      registrosIdiomas: linhasIdiomas.length,
      registrosNacionalidades: linhasNacionalidades.length,
      registrosUsuarios: linhasUsuarios.length,
      registrosAutores: linhasAutores.length,
      registrosBibliotecas: linhasBibliotecas.length,
      registrosColecons: linhasColecons.length,
      registrosEditoriais: linhasEditoriais.length,
      registrosGeneros: linhasGeneros.length,
      registrosLivros: linhasLivros.length,
      registrosRelecturas: linhasRelecturas.length,
      registrosAutoresR: linhasAutoresR.length,
      registrosGenerosR: linhasGenerosR.length,
      registrosEstilosLiterarios: linhasEstilosLiterarios.length
    };
  } catch (err) {
    console.error(`Erro ao executar salvarDadosSQL em zmantementos-salvar-dados.js`, err.message);
    return false;
  }
}

export default {
  salvarDadosSQL,
};