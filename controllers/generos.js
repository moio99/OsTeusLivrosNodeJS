import generos from '../services/generos.js';

export class GeneroController {
  static async getAll(req, res, next) {
    try {
      res.json(await generos.getGeneros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os generos.`, err.message);
      next(err);
    }
  }

  static async getGenerosCosLivros(req, res, next) {
    try {
      res.json(await generos.getGenerosCosLivros(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter os generos cos libros.`, err.message);
      next(err);
    }
  }

  static async getGenero(req, res, next) {
    try {
      res.json(await generos.getGenero(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o genero.`, err.message);
      next(err);
    }
  }

  static async getGeneroPorNome(req, res, next) {
    try {
      res.json(await generos.getGeneroPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter o genero polo nome.`, err.message);
      next(err);
    }
  }

  static async getGeneroNome(req, res, next) {
    try {
      res.json(await generos.getGeneroNome(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter o nome do genero.`, err.message);
      next(err);
    }
  }

  static async postGenero(req, res, next) {
    try {
      res.json(await generos.postGenero(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando crear um genero.`, err.message);
      next(err);
    }
  }

  static async putGenero(req, res, next) {
    try {
      res.json(await generos.putGenero(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar um genero.`, err.message);
      next(err);
    }
  }

  static async deleteGenero(req, res, next) {
    try {
      if (req.query.id === undefined) {
        return res.status(400).json({ error: 'Falta o parámetro id' });
      }
      res.json(await generos.borrarGenero(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro tentando eliminar um genero.`, err.message);
      next(err);
    }
  }
}

export default GeneroController;
