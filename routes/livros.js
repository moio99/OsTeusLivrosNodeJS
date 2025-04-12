const express = require('express');
const router = express.Router();
const livros = require('../services/livros');

/**
 * GET
 */
 router.get('/', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivros(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/LivrosParaMovel', async function(req, res, next) {
  try {
    if (process.env.NODE_ENTORNO === 'local') {
      res.json(await livros.getLivrosParaMovel(req.idUsuario));
    } else {
      res.status(404).send({ error: 'unknown endpoint' });
    }
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET
 */
router.get('/LivroPorTitulo', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivroPorTitulo(req.idUsuario, req.query.titulo));
  } catch (err) {
    console.error(`Erro ao obter o livro polo título `, err.message);
    next(err);
  }
});

/**
 * GET por última lectura.
 */
 router.get('/UltimaLectura', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosUltimaLectura(req.idUsuario));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Idioma
 */
router.get('/PorIdioma', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorIdioma(req.idUsuario, req.query.Idioma));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Ano
 */
router.get('/PorAno', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorAno(req.idUsuario, req.query.Ano));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Autor
 */
router.get('/PorAutor', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.query.page));
    res.json(await livros.getLivrosPorAutor(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Genero
 */
router.get('/PorGenero', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivrosPorGenero(req.idUsuario, req.query.Genero));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Editorial
 */
router.get('/PorEditorial', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivrosPorEditorial(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Biblioteca
 */
router.get('/PorBiblioteca', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivrosPorBiblioteca(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por Colecom
 */
router.get('/PorColecom', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivrosPorColecom(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});

/**
 * GET por estiloLiterario
 */
router.get('/PorEstiloLiterario', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivrosPorEstiloLiterario(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});


/**
 * GET Livro
 */
 router.get('/Livro', async function(req, res, next) {
  try {
    // res.json(await programmingLanguages.getMultiple(req.idUsuario, req.query.page));
    res.json(await livros.getLivro(req.idUsuario, req.query.id));
  } catch (err) {
    console.error(`Erro ao obter o livro `, err.message);
    next(err);
  }
});

/* POST Livro */
router.post('/Livro', async function(req, res, next) {
  try {
    res.json(await livros.postLivro(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando criar um livro`, err.message);
    next(err);
  }
});

/* PUT Livro */
router.put('/Livro', async function(req, res, next) {
  try {
    res.json(await livros.putLivro(req.idUsuario, req.body));
  } catch (err) {
    console.error(`Erro tentando actualizar um livro`, err.message);
    next(err);
  }
});

/* DELETE Livro */
router.delete('/Livro', async function(req, res, next) {
  try {
    if (req.query.id != undefined)
      res.json(await livros.borrarLivro(req.idUsuario, req.query.id));
    else
      console.error('Nom chegou o id');
  } catch (err) {
    console.error(`Erro tentando borrar um livro`, err.message);
    next(err);
  }
});
module.exports = router;