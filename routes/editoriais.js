const express = require('express');
const router = express.Router();
const editoriais = require('../services/editoriais');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditoriais());
  } catch (err) {
    console.error(`Erro ao obter as editoriais `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/EditorialPorNome', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditorialPorNome(req.idUsuario, req.query.nome));
  } catch (err) {
    console.error(`Erro ao obter a editorial polo nome `, err.message);
    next(err);
  }
});


/**
 * GET
 */
 router.get('/EditoriaisCosLivros', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditoriaisCosLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter as editoriais cos livros`, err.message);
    next(err);
  }
});

/**
 * GET
 */
 router.get('/Editorial', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await editoriais.getEditorial(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter a editorial `, err.message);
    next(err);
  }
});

/* POST Editorial */
router.post('/Editorial', async function(req, res, next) {
  try {
    res.json(await editoriais.postEditorial(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar umha editorial`, err.message);
    next(err);
  }
});

/* PUT Editorial */
router.put('/Editorial', async function(req, res, next) {
  try {
    res.json(await editoriais.putEditorial(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar umha editorial`, err.message);
    next(err);
  }
});

/* DELETE Editorial */
router.delete('/Editorial', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await editoriais.borrarEditorial(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar umha editorial`, err.message);
    next(err);
  }
});

module.exports = router;