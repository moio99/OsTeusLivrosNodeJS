const express = require('express');
const router = express.Router();
const estiloLiterario = require('../services/estilosLiterarios');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await estiloLiterario.getEstilosLiterarios(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os Estilos Literarios `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/EstilosLiterariosCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await estiloLiterario.getEstilosLiterariosCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os Estilos Literarios cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/EstiloLiterario', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await estiloLiterario.getEstilosLiterario(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o EstiloLiterario `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/EstiloLiterarioPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await estiloLiterario.getEstiloLiterarioPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter o Estilo Literario polo nome `, err.message);
    next(err);
  }
});

/* router.get('/GeneroNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await estiloLiterario.getGeneroNome(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o generoNome `, err.message);
    next(err);
  }
}); */

/* POST EstiloLiterario */
router.post('/EstiloLiterario', async function(req, res, next) {
  try {
    res.json(await estiloLiterario.postEstiloLiterario(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar um Estilo Literario`, err.message);
    next(err);
  }
});

/* PUT EstiloLiterario */
router.put('/EstiloLiterario', async function(req, res, next) {
  try {
    res.json(await estiloLiterario.putEstiloLiterario(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar um Estilo Literario`, err.message);
    next(err);
  }
});

/* DELETE EstiloLiterario */
router.delete('/EstiloLiterario', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await estiloLiterario.borrarEstiloLiterario(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar um Estilo Literario`, err.message);
    next(err);
  }
});

module.exports = router;