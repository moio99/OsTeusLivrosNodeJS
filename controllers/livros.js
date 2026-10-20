import livros from '../services/livros.js';

export class LivroController {
  static async getAll(req, res, next) {
    try {
      res.json(await livros.getLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os libros`, err.message);
      next(err);
    }
  }

  static async getLivrosParaMovel(req, res, next) {
    try {
      if (process.env.NODE_ENTORNO !== 'local') {
        return res.status(404).send({ error: 'unknown endpoint' });
      }
      res.json(await livros.getLivrosParaListadoMovel(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os libros para o móbil`, err.message);
      next(err);
    }
  }

  static async getLivroPorTitulo(req, res, next) {
    try {
      res.json(await livros.getLivroPorTitulo(req.idUsuario, req.query.titulo));
    } catch (err) {
      console.error(`Erro ao obter o libro polo titulo`, err.message);
      next(err);
    }
  }

  static async getUltimaLectura(req, res, next) {
    try {
      res.json(await livros.getLivrosUltimaLectura(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os libros da ultima lectura`, err.message);
      next(err);
    }
  }

  static async getPorIdioma(req, res, next) {
    try {
      res.json(await livros.getLivrosPorIdioma(req.idUsuario, req.query.Idioma));
    } catch (err) {
      console.error(`Erro ao obter os libros por idioma`, err.message);
      next(err);
    }
  }

  static async getPorAno(req, res, next) {
    try {
      res.json(await livros.getLivrosPorAno(req.idUsuario, req.query.Ano));
    } catch (err) {
      console.error(`Erro ao obter os libros por ano`, err.message);
      next(err);
    }
  }

  static async getPorAutor(req, res, next) {
    try {
      res.json(await livros.getLivrosPorAutor(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter os libros por autor`, err.message);
      next(err);
    }
  }

  static async getPorGenero(req, res, next) {
    try {
      res.json(await livros.getLivrosPorGenero(req.idUsuario, req.query.Genero));
    } catch (err) {
      console.error(`Erro ao obter os libros por xenero`, err.message);
      next(err);
    }
  }

  static async getPorEditorial(req, res, next) {
    try {
      res.json(await livros.getLivrosPorEditorial(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter os libros por editorial`, err.message);
      next(err);
    }
  }

  static async getPorBiblioteca(req, res, next) {
    try {
      res.json(await livros.getLivrosPorBiblioteca(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter os libros por biblioteca`, err.message);
      next(err);
    }
  }

  static async getPorColecom(req, res, next) {
    try {
      res.json(await livros.getLivrosPorColecom(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter os libros por coleccion`, err.message);
      next(err);
    }
  }

  static async getPorEstiloLiterario(req, res, next) {
    try {
      res.json(await livros.getLivrosPorEstiloLiterario(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter os libros por estilo literario`, err.message);
      next(err);
    }
  }

  static async getLivro(req, res, next) {
    try {
      res.json(await livros.getLivro(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o libro`, err.message);
      next(err);
    }
  }

  static async postLivro(req, res, next) {
    try {
      res.json(await livros.postLivro(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando crear um libro`, err.message);
      next(err);
    }
  }

  static async putLivro(req, res, next) {
    try {
      res.json(await livros.putLivro(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar um libro`, err.message);
      next(err);
    }
  }

  static async deleteLivro(req, res, next) {
    try {
      if (req.query.id === undefined) {
        return res.status(400).json({ error: 'Falta o parámetro id' });
      }
      res.json(await livros.borrarLivro(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro tentando eliminar um libro`, err.message);
      next(err);
    }
  }
}

export default LivroController;
