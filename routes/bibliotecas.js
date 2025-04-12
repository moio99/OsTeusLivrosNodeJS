const express = require('express');
const router = express.Router();
const bibliotecas = require('../services/bibliotecas');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBibliotecas(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as bibliotecas `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/BibliotecaPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBibliotecaPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter a biblioteca polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/BibliotecasCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBibliotecasCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as bibliotecas cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Biblioteca', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await bibliotecas.getBiblioteca(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter a biblioteca `, err.message);
    next(err);
  }
});

/* POST Biblioteca */
router.post('/Biblioteca', async function(req, res, next) {
  try {
    res.json(await bibliotecas.postBiblioteca(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha biblioteca`, err.message);
    next(err);
  }
});

/* PUT Biblioteca */
router.put('/Biblioteca', async function(req, res, next) {
  try {
    res.json(await bibliotecas.putBiblioteca(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha biblioteca`, err.message);
    next(err);
  }
});

/* DELETE Biblioteca */
router.delete('/Biblioteca', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await bibliotecas.borrarBiblioteca(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha biblioteca`, err.message);
    next(err);
  }
});

module.exports = router;