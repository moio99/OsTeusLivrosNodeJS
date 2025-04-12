const express = require('express');
const router = express.Router();
const colecons = require('../services/colecons');

/**
 * GET
 */
/* router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await colecons.getColecons(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as colecons `, err.message);
    next(err);
  }
}); */

/**
 * GET
 */
router.get('/ColecomPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await colecons.getColecomPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter a colecom polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/ColeconsCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await colecons.getColeconsCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as colecons cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Colecom', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await colecons.getColecom(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter a colecom `, err.message);
    next(err);
  }
});

/* POST Colecom */
router.post('/Colecom', async function(req, res, next) {
  try {
    res.json(await colecons.postColecom(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha colecom`, err.message);
    next(err);
  }
});

/* PUT Colecom */
router.put('/Colecom', async function(req, res, next) {
  try {
    res.json(await colecons.putColecom(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha colecom`, err.message);
    next(err);
  }
});

/* DELETE Colecom */
router.delete('/Colecom', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await colecons.borrarColecom(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha colecom`, err.message);
    next(err);
  }
});

module.exports = router;