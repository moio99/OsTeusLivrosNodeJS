const express = require('express');
const router = express.Router();
const outros = require('../services/outros');

/**
 * GET Nacionalidades
 */
 router.get('/Nacionalidades', async function(req, res, next) {
  try {
    res.json(await outros.getNacionalidades(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as nacionalidades`, err.message);
    next(err);
  }
});

/**
 * GET Nacionalidade nome
 */
router.get('/NacionalidadeNome', async function(req, res, next) {
  try {
    res.json(await outros.getNacionalidadeNome(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o nome da nacionalidade`, err.message);
    next(err);
  }
});

/**
 * GET Paises
 */
 router.get('/Paises', async function(req, res, next) {
  try {
    res.json(await outros.getPaises(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os paises`, err.message);
    next(err);
  }
});

/**
 * GET Pais nome
 */
router.get('/PaisNome', async function(req, res, next) {
  try {
    res.json(await outros.getPaisNome(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o nome do pais`, err.message);
    next(err);
  }
});

/**
 * GET Idioma nome
 */
router.get('/IdiomaNome', async function(req, res, next) {
  try {
    res.json(await outros.getIdiomaNome(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o nome do idioma`, err.message);
    next(err);
  }
});

/**
 * GET Bibliotecas
 */
 router.get('/Bibliotecas', async function(req, res, next) {
  try {
    res.json(await outros.getBibliotecas(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as bibliotecas`, err.message);
    next(err);
  }
});

/**
 * GET Generos
 */
 router.get('/Generos', async function(req, res, next) {
  try {
    res.json(await outros.getGeneros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os generos`, err.message);
    next(err);
  }
});

/**
 * GET Todo
 */
 router.get('/Todo', async function(req, res, next) {
  try {
    res.json(await outros.getTodo(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  }
});

module.exports = router;