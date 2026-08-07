import express from 'express';
const router = express.Router();
import db from '../utils/db.js';
import estadisticas from '../services/estadisticas.js';
import subidaWeb from '../services/zmantemento-subida-web.js';
import ciarBD from '../services/zmantemento-criar-BD.js';
import salvarDados from '../services/zmantemento-salvar-dados.js';

// Query para crear la tabla
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Continente (
    idContinente SMALLSERIAL NOT NULL,
    Nome VARCHAR(15) NOT NULL,
    PRIMARY KEY (idContinente)
  );
`;

router.get('/ProbaC', async function(req, res, next) {
  console.log('Petiçom /ProbaC');
  // Ejecutar la consulta
  db.pool.query(createTableQuery, (err, res) => {
    if (err) {
      console.error('Error ao crear a taboa:', err);
    } else {
      console.log('✅ taboa creada exitosamente');
    }
  });
  
  res.json({
    success: true,
    livros: 'taboa "..." creada exitosamente'
  });
});

// SELECT
router.get('/ProbaAa', async function(req, res, next) {
  console.log('Petiçom /ProbaAa');
  try {
    const resultado = await estadisticas.getEstadisticas('2', '3');
    res.json(resultado);
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  }
});

router.get('/ProbaA', async function(req, res, next) {
  console.log('Petiçom /ProbaA');
  const pgClient = await db.pool.connect();
  try {
    res.json(await pgClient.query(
      'SELECT * FROM casas'
    ));
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  } finally {
    pgClient.release();
  }
});

// CRIAÇOM
router.get('/ProbaC', async function(req, res, next) {
  console.log('Petiçom /ProbaC');
  const { nome, email, idade } = req.query;
  try {
    res.json(await db.pool.query(
      `INSERT INTO usuarios2 (nombre, email, edad) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [nome, email, idade]
    ));
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  }
});

// Update
router.get('/ProbaU', async function(req, res, next) {
  console.log('Petiçom /ProbaC PosgreSQL');
  // const { nome, email, idade } = req.query;
  try {
    res.json(await db.pool.query(
      `UPDATE public.casas
        SET "data"=now(), nome=$1, valor=$2
        WHERE id=1;`,
        ['primeiro', 300]
    ));
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  }
});

// INSERT
router.get('/SubidaAWeb', async function(req, res, next) {
  console.log('Petiçom /SubidaAWeb');
  try {
    const resultado = await subidaWeb.subidaWeb();
    if (!resultado) {
      console.error('❌ Erro ao subir os dados à web');
      return res.status(500).json({ error: 'Erro ao subir os dados à web' });
    }
    console.log('✅ Dados subidos à web com sucesso');
    res.json(resultado);
  } catch (err) {
    console.error(`Erro subindo os dados à web `, err.message);
    next(err);
  }
});

router.get('/CiarSQLsBD', async function(req, res, next) {
  console.log('Petiçom /CiarSQLsBD');
  try {
    const resultado = await ciarBD.ciarSQLsCriacomBD(req.query.nomeBD);
    if (!resultado) {
      console.error('❌ Erro ao criar os arquivos');
      return res.status(500).json({ error: 'Erro ao criar os arquivos' });
    }
    console.log('✅ Arquivos criados com sucesso');
    res.json(resultado);
  } catch (err) {
    console.error(`Erro guardando os dados `, err.message);
    next(err);
  }
});

router.get('/CiarSQLsInsercom', async function(req, res, next) {
  console.log('Petiçom /CiarSQLsInsercom');
  try {
    const resultado = await salvarDados.salvarDadosSQL(req.query.nomeBD);
    if (!resultado) {
      console.error('❌ Erro ao criar os arquivos');
      return res.status(500).json({ error: 'Erro ao criar os arquivos' });
    }
    console.log('✅ Arquivos criados com sucesso');
    res.json(resultado);
  } catch (err) {
    console.error(`Erro guardando os dados `, err.message);
    next(err);
  }
});

export default router;