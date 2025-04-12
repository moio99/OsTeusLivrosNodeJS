const express = require('express');
const router = express.Router();
const autores = require('../services/autores');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutores(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as autores `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/AutorPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutorPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter o autor polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/AutoresPorNacons', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutoresPorNacons(req.idUsuario));
  } catch (err) {
   /*  console.error(`Erro ao obter as autores por naçons`, err.message);
    next(err); */
  }
});

/**
 * GET
 */
 router.get('/AutoresPorPaises', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutoresPorPaises(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as autores por paises`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/AutoresFiltrados', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutoresFiltrados(req.idUsuario, req.query.id, req.query.tipo));
  } catch (err) {
    console.error(`Erro ao obter as autores filtrados`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Autor', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await autores.getAutor(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o autor `, err.message);
    next(err);
  }
});

/* POST Autor */
router.post('/Autor', async function(req, res, next) {
  try {
    res.json(await autores.postAutor(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar um autor`, err.message);
    next(err);
  }
});

/* PUT Autor */
router.put('/Autor', async function(req, res, next) {
  try {
    res.json(await autores.putAutor(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar um autor`, err.message);
    next(err);
  }
});

/* DELETE Autor */
router.delete('/Autor', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await autores.borrarAutor(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar um autor`, err.message);
    next(err);
  }
});

module.exports = router;