const express = require('express');
const router = express.Router();
const relecturas = require('../services/relecturas');

/**
 * GET
 */
/* router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await relecturas.getColecons(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as relecturas `, err.message);
    next(err);
  }
}); */

/**
 * GET dumha relectura dum livro
 */
router.get('/Relectura', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await relecturas.getRelectura(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter umha relectura `, err.message);
    next(err);
  }
});

/**
 * GET das relecturas dum livro
 */
 router.get('/Relecturas', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await relecturas.getRelecturas(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter as relecturas `, err.message);
    next(err);
  }
});

/* POST Relectura */
router.post('/Relectura', async function(req, res, next) {
  console.log('chega post');
  try {
    res.json(await relecturas.postRelectura(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha relectura`, err.message);
    next(err);
  }
});

/* PUT Relectura */
router.put('/Relectura', async function(req, res, next) {
  try {
    res.json(await relecturas.putRelectura(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha relectura`, err.message);
    next(err);
  }
});

/* DELETE Relectura */
router.delete('/Relectura', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await relecturas.borrarRelectura(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha relectura`, err.message);
    next(err);
  }
});

module.exports = router;