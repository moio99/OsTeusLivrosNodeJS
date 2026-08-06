import db from '../utils/db.js';
import helper from '../utils/helper.js';

async function subidaWeb(idUsuario){
  console.log('Petiçom de subidaWeb ' + new Date().toJSON());
  const pgClient = await db.pool.connect();
  try {
    // await pgClient.query('BEGIN');
    await pgClient.query('DELETE FROM EstiloLiterario');
    await pgClient.query('DELETE FROM Generos');
    await pgClient.query('DELETE FROM Autores');
    await pgClient.query('DELETE FROM Relectura');
    await pgClient.query('DELETE FROM Livro');
    await pgClient.query('DELETE FROM Genero');
    await pgClient.query('DELETE FROM Editorial');
    await pgClient.query('DELETE FROM Colecom');
    await pgClient.query('DELETE FROM Biblioteca');
    await pgClient.query('DELETE FROM Autor');
    // await pgClient.query('DELETE FROM Usuario');
    // await pgClient.query('DELETE FROM Nacionalidade');
    // await pgClient.query('DELETE FROM Idioma');
    // await pgClient.query('DELETE FROM Pais');
    // await pgClient.query('DELETE FROM Continente');
    // const resContinentes = await migrateContinentes(pgClient);
    // const resPaises = await migratePaises(pgClient);
    // const resIdiomas = await migrateIdiomas(pgClient);
    // const resNacionalidades = await migrateNacionalidades(pgClient);
    // const resUsuarios = await migrateUsuarios(pgClient);
    const resAutores = await migrateAutores(pgClient);
    const resBibliotecas = await migrateBibliotecas(pgClient);
    const resColecons = await migrateColecons(pgClient);
    const resEditoriais = await migrateEditoriais(pgClient);
    const resGeneros = await migrateGeneros(pgClient);
    const resLivros = await migrateLivros(pgClient);
    const resRelecturas = await migrateRelecturas(pgClient);
    const resAutoresN = await migrateAutoresN(pgClient);
    const resGenerosN = await migrateGenerosN(pgClient);
    const resEstilosLiterarios = await migrateEstilosLiterarios(pgClient);
    
    console.log('🎉 ✅✅✅ Fim da migraçom ✅✅✅ 🎉');
    
    return {
      // continentes: resContinentes,
      // paises: resPaises,
      // idiomas: resIdiomas,
      // nacionalidades: resNacionalidades,
      // usuarios: resUsuarios,
      autores: resAutores,
      bibliotecas: resBibliotecas,
      colecons: resColecons,
      editoriais: resEditoriais,
      generos: resGeneros,
      livros: resLivros,
      relecturas: resRelecturas,
      autoresN: resAutoresN,
      generosN: resGenerosN,
      estilosLiterarios: resEstilosLiterarios
    };
  } catch (err) {
    console.error(`Erro ao realizar a migraçom em zmantemento-subida-web`, err.message);
    next(err);
  } finally {
    pgClient.release();
    db.pool.end();
  }

  return false;
}


async function migrateContinentes(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Continente', null, true);
    console.log(`✅ atopárom-se ${rows.length} continentes em MySQL`);

    for (const row of rows) {
      await pgClient.query(
        'INSERT INTO Continente (idContinente, Nome) VALUES ($1, $2)',
        [row.idContinente, row.Nome]
      );
    }
    console.log('🎉 migraçom completada com éxito Continente');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Continente:', error);
    throw error;
  }
}

async function migratePaises(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Pais', null, true);
    console.log(`✅ atopárom-se ${rows.length} paises em MySQL`);
    
    await pgClient.query('BEGIN');   
    for (const pais of rows) {
      await pgClient.query(`
        INSERT INTO Pais (idPais, Nome, fkContinente)
        VALUES ($1, $2, $3)
        ON CONFLICT (idPais) DO NOTHING
      `, [pais.idPais, pais.Nome, pais.fkContinente]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Pais');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Pais:', error);
    throw error;
  }
}

async function migrateIdiomas(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Idioma', null, true);
    console.log(`✅ atopárom-se ${rows.length} idiomas em MySQL`);

    await pgClient.query('BEGIN');   
    for (const idioma of rows) {
      await pgClient.query(`
        INSERT INTO Idioma (idIdioma, Nome, Codigo)
        VALUES ($1, $2, $3)
        ON CONFLICT (idIdioma) DO NOTHING
      `, [idioma.idIdioma, idioma.Nome, idioma.Codigo]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Idioma');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Idioma:', error);
    throw error;
  }
}

async function migrateNacionalidades(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Nacionalidade', null, true);
    console.log(`✅ atopárom-se ${rows.length} Nacionalidades em MySQL`);

    await pgClient.query('BEGIN');   
    for (const elemento of rows) {
      await pgClient.query(`
        INSERT INTO Nacionalidade (
          idNacionalidade, 
          Nome, 
          fkPais, 
          fkContinente
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (idNacionalidade) DO NOTHING
      `, [elemento.idNacionalidade, elemento.Nome, elemento.fkPais, elemento.fkContinente]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Nacionalidade');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Nacionalidade:', error);
    throw error;
  }
}

async function migrateUsuarios(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Usuario', null, true);
    console.log(`✅ atopárom-se ${rows.length} Usuarios em MySQL`);

    await pgClient.query('BEGIN');   
    for (const u of rows) {
      await pgClient.query(`
        INSERT INTO Usuario (
          idUsuario, Nome, pass, Pergunta, 
          Contestacom, Correio, fkIdioma, Ativado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (idUsuario) DO NOTHING
      `, [
        u.idUsuario, u.Nome, u.pass, u.Pergunta,
        u.Contestacom, u.Correio, u.fkIdioma, u.Ativado
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Usuario');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Usuario:', error);
    throw error;
  }
}

async function migrateAutores(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Autor', null, true);
    console.log(`✅ atopárom-se ${rows.length} Autores em MySQL`);

    await pgClient.query('BEGIN');   
    for (const a of rows) {
      await pgClient.query(`
        INSERT INTO Autor (
          idAutor, fkUsuario, Nome, NomeReal, fkNacionalidade, fkPais, LugarNacemento, 
          DataNacemento, DataDefuncom, Premios, web, Comentario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (idAutor) DO NOTHING
      `, [
        a.idAutor, a.fkUsuario, a.Nome, a.NomeReal, a.fkNacionalidade, a.fkPais, a.LugarNacemento, 
        a.DataNacemento, a.DataDefuncom, a.Premios, a.web, a.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Autor');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Autor:', error);
    throw error;
  }
}

async function migrateBibliotecas(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Biblioteca', null, true);
    console.log(`✅ atopárom-se ${rows.length} Bibliotecas em MySQL`);

    await pgClient.query('BEGIN');   
    for (const b of rows) {
      await pgClient.query(`
        INSERT INTO Biblioteca (idBiblioteca, fkUsuario, Nome, Endereco, Localidade, Telefone, 
          DataAsociamento, DataRenovacom, Comentario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (idBiblioteca) DO NOTHING
      `, [
        b.idBiblioteca, b.fkUsuario, b.Nome, b.Endereco, b.Localidade, b.Telefone, 
        b.DataAsociamento, b.DataRenovacom, b.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Biblioteca');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Biblioteca:', error);
    throw error;
  }
}

async function migrateColecons(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Colecom', null, true);
    console.log(`✅ atopárom-se ${rows.length} Colecons em MySQL`);

    await pgClient.query('BEGIN');   
    for (const c of rows) {
      await pgClient.query(`
        INSERT INTO Colecom (idColecom, fkUsuario, Nome, ISBN, web, Comentario
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (idColecom) DO NOTHING
      `, [
        c.idColecom, c.fkUsuario, c.Nome, c.ISBN, c.web, c.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Colecom');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Colecom:', error);
    throw error;
  }
}

async function migrateEditoriais(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Editorial', null, true);
    console.log(`✅ atopárom-se ${rows.length} Editoriais em MySQL`);

    await pgClient.query('BEGIN');   
    for (const e of rows) {
      await pgClient.query(`
        INSERT INTO Editorial (idEditorial, fkUsuario, Nome, Direicom, web, Comentario
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (idEditorial) DO NOTHING
      `, [
        e.idEditorial, e.fkUsuario, e.Nome, e.Direicom, e.web, e.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Editorial');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Editorial:', error);
    throw error;
  }
}

async function migrateGeneros(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Genero', null, true);
    console.log(`✅ atopárom-se ${rows.length} Generos em MySQL`);

    await pgClient.query('BEGIN');   
    for (const g of rows) {
      await pgClient.query(`
        INSERT INTO Genero (idGenero, fkUsuario, Nome, Comentario
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (idGenero) DO NOTHING
      `, [
        g.idGenero, g.fkUsuario, g.Nome, g.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Genero');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom Genero:', error);
    throw error;
  }
}

async function migrateLivros(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Livro WHERE fkUsuario = 2', null, true);
    console.log(`✅ atopárom-se ${rows.length} Livros em MySQL`);

    await pgClient.query('BEGIN');
    
    // 2. Validaçom adicional de datos
    for (const l of rows) {
      // Convertir valores NULL/undefined explícitamente
      const DataFimLeitura = l.DataFimLeitura || null;
      const fkSubGenero = l.fkSubGenero || null;
      const fkBiblioteca = l.fkBiblioteca || null;
      const fkEditorial = l.fkEditorial || null;
      const fkColecom = l.fkColecom || null;
      const fkEstilo = l.fkEstilo || null;

      // console.log(`Migrando livro ID: ${l.idLivro}, Título: ${l.Titulo}`);

      try {
        await pgClient.query(`
          INSERT INTO Livro (
            idLivro, fkUsuario, Titulo, TituloOriginal, fkGenero, fkSubGenero, 
            fkBiblioteca, fkEditorial, fkColecom, ISBN, Electronico, Paginas, 
            PaginasLidas, Lido, TempoLeitura, DataFimLeitura, fkIdioma, fkIdiomaOriginal, 
            DataCriacom, DataEdicom, NumeroEdicom, Premios, Descricom, Comentario, Pontuacom, 
            fkIdiomaDaEntrada, SomSerie, idSerie, fkEstilo
          ) VALUES (
            $1, $2, $3, $4, $5, $6, 
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18,
            $19, $20, $21, $22, $23, $24, $25,
            $26, $27, $28, $29
          )
          ON CONFLICT (idLivro) DO NOTHING
        `, [
          l.idLivro, l.fkUsuario, l.Titulo, l.TituloOriginal || null, 
          l.fkGenero, fkSubGenero, 
          fkBiblioteca, fkEditorial, fkColecom, 
          l.ISBN || null, 
          l.Electronico === 1, // Convertir tinyint(1) a boolean
          l.Paginas, 
          l.PaginasLidas || null, 
          l.Lido === 1, // Convertir tinyint(1) a boolean
          l.TempoLeitura || null, 
          DataFimLeitura,
          l.fkIdioma || null, 
          l.fkIdiomaOriginal || null, 
          l.DataCriacom || null, 
          l.DataEdicom || null, 
          l.NumeroEdicom || null, 
          l.Premios || null, 
          l.Descricom || null, 
          l.Comentario || null, 
          l.Pontuacom || null, 
          l.fkIdiomaDaEntrada, 
          l.SomSerie === 1, // Convertir tinyint(1) a boolean
          l.idSerie || null, 
          fkEstilo
        ]);
      } catch (insertError) {
        console.error(`Erro inserindo livro ID ${l.idLivro}:`, insertError.message);
      }
    }
    
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Livro');
    return rows.length;
    
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Erro durante a migraçom Livro:', error.message);
    throw error;
  }
}

async function migrateRelecturas(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Relectura WHERE fkUsuario = 2', null, true);
    console.log(`✅ atopárom-se ${rows.length} Relecturas em MySQL`);

    await pgClient.query('BEGIN');
    for (const l of rows) {
      // Convertir valores NULL/undefined explícitamente
      const DataFimLeitura = l.DataFimLeitura || null;
      const fkBiblioteca = l.fkBiblioteca || null;
      const fkEditorial = l.fkEditorial || null;
      const fkColecom = l.fkColecom || null;

      // console.log(`Migrando relectura ID: ${l.idRelectura}, Titulo: ${l.Tttulo}`);

      try {
        await pgClient.query(`
          INSERT INTO Relectura (
            idRelectura, Titulo, fkLivro, fkUsuario, 
            fkBiblioteca, fkEditorial, fkColecom, ISBN, Electronico, Paginas, PaginasLidas, 
            Lido, TempoLeitura, DataFimLeitura, fkIdioma, DataEdicom, NumeroEdicom, Comentario, 
            Pontuacom, fkIdiomaDaEntrada, SomSerie, idSerie
          ) VALUES (
            $1, $2, $3, $4, 
            $5, $6, $7, $8, $9, $10, $11, 
            $12, $13, $14, $15, $16, $17, $18, 
            $19, $20, $21, $22
          )
          ON CONFLICT (idRelectura) DO NOTHING
        `, [
          l.idRelectura, l.Titulo, l.fkLivro, l.fkUsuario,
          fkBiblioteca, fkEditorial, fkColecom, 
          l.ISBN || null, 
          l.Electronico === 1, // Convertir tinyint(1) a boolean
          l.Paginas, 
          l.PaginasLidas || null, 
          l.Lido === 1, // Convertir tinyint(1) a boolean
          l.TempoLeitura || null, 
          DataFimLeitura,
          l.fkIdioma || null,
          l.DataEdicom || null, 
          l.NumeroEdicom || null,  
          l.Comentario || null, 
          l.Pontuacom || null, 
          l.fkIdiomaDaEntrada, 
          l.SomSerie === 1, // Convertir tinyint(1) a boolean
          l.idSerie || null
        ]);
      } catch (insertError) {
        console.error(`Error insertando relectura ID ${l.idRelectura}:`, insertError.message);
      }
    }
    
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito Relectura');
    return rows.length;
    
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error('❌ Erro durante a migraçom Relectura:', error.message);
    throw error;
  }
}

async function migrateAutoresN(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Autores WHERE fkUsuario = 2', null, true);
    console.log(`✅ atopárom-se ${rows.length} AutoresN em MySQL`);

    await pgClient.query('BEGIN');
    for (const a of rows) {
      // console.log(`Migrando autores ID: ${a.idAutores}, autor: ${a.fkAutor}`);
      await pgClient.query(`
        INSERT INTO Autores (idAutores, fkUsuario, fkLivro, fkAutor
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (idAutores) DO NOTHING
      `, [
        a.idAutores, a.fkUsuario, a.fkLivro, a.fkAutor
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito AutoresN');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom AutoresN:', error);
    throw error;
  }
}

async function migrateGenerosN(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM Generos WHERE fkUsuario = 2', null, true);
    console.log(`✅ atopárom-se ${rows.length} GenerosN em MySQL`);

    await pgClient.query('BEGIN');   
    for (const g of rows) {
      // console.log(`Migrando generosN ID: ${g.idGeneros}, genero: ${g.fkGenero}`);
      await pgClient.query(`
        INSERT INTO Generos (
          idGeneros, fkUsuario, fkLivro, fkGenero
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (idGeneros) DO NOTHING
      `, [
        g.idGeneros, g.fkUsuario, g.fkLivro, g.fkGenero
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito GenerosN');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom GenerosN:', error);
    throw error;
  }
}

async function migrateEstilosLiterarios(pgClient) {
  try {
    const rows = await db.query('SELECT * FROM EstiloLiterario', null, true);
    console.log(`✅ atopárom-se ${rows.length} EstilosLiterarios em MySQL`);

    await pgClient.query('BEGIN');   
    for (const e of rows) {
      await pgClient.query(`
        INSERT INTO EstiloLiterario (idEstilo, fkUsuario, Nome, Comentario
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (idEstilo) DO NOTHING
      `, [
        e.idEstilo, e.fkUsuario, e.Nome, e.Comentario
      ]);
    }
    await pgClient.query('COMMIT');
    console.log('🎉 migraçom completada com éxito EstiloLiterario');
    return rows.length;
  } catch (error) {
    console.error('❌ Erro durante a migraçom EstiloLiterario:', error);
    throw error;
  }
}

export default {
  subidaWeb
}