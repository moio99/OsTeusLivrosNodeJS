const express = require('express');
const router = express.Router();
const generos = require('../services/generos');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await generos.getGeneros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os generos `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/GenerosCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await generos.getGenerosCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os generos cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Genero', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await generos.getGenero(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o genero `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/GeneroPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await generos.getGeneroPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter o genero polo nome `, err.message);
    next(err);
  }
});

router.get('/GeneroNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await generos.getGeneroNome(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o generoNome `, err.message);
    next(err);
  }
});

/* POST Genero */
router.post('/Genero', async function(req, res, next) {
  try {
    res.json(await generos.postGenero(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar um genero`, err.message);
    next(err);
  }
});

/* PUT Genero */
router.put('/Genero', async function(req, res, next) {
  try {
    res.json(await generos.putGenero(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar um genero`, err.message);
    next(err);
  }
});

/* DELETE Genero */
router.delete('/Genero', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await generos.borrarGenero(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar um genero`, err.message);
    next(err);
  }
});

module.exports = router;