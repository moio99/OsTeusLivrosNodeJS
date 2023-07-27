const express = require('express');
const router = express.Router();
const outros = require('../services/outros');

/**
 * GET Nacionalidades
 */
 router.get('/Nacionalidades', async function(req, res, next) {
  try {
    res.json(await outros.getNacionalidades());
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
    res.json(await outros.getNacionalidadeNome(req.query.id));
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
    res.json(await outros.getPaises());
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
    res.json(await outros.getPaisNome(req.query.id));
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
    res.json(await outros.getIdiomaNome(req.query.id));
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
    res.json(await outros.getBibliotecas());
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
    res.json(await outros.getGeneros());
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
    res.json(await outros.getTodo());
  } catch (err) {
    console.error(`Erro ao obter os dados de Outros`, err.message);
    next(err);
  }
});

module.exports = router;