import relecturas from '../services/relecturas.js';

export class RelecturaController {
  static async getRelectura(req, res, next) {
    try {
      res.json(await relecturas.getRelectura(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter unha relectura.`, err.message);
      next(err);
    }
  }

  static async getRelecturas(req, res, next) {
    try {
      res.json(await relecturas.getRelecturas(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter as relecturas.`, err.message);
      next(err);
    }
  }
  
  static async getRelecturasPorTitulo(req, res, next) {
    try {
      res.json(await relecturas.getRelecturasPorTitulo (
        req.idUsuario, 
        Number(req.query.idLivro), 
        req.query.titulo));
    } catch (err) {
      console.error(`Erro ao obter a relectura polo titulo.`, err.message);
      next(err);
    }
  }
  
  static async getPorSerie(req, res, next) {
    try {
      res.json(await relecturas.getRelecturasSerie(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro ao obter as relecturas polo id da primeira da serie.`, err.message);
      next(err);
    }
  }

  static async postRelectura(req, res, next) {
    try {
      res.json(await relecturas.postRelectura(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando crear unha relectura.`, err.message);
      next(err);
    }
  }

  static async putRelectura(req, res, next) {
    try {
      res.json(await relecturas.putRelectura(req.idUsuario, req.body));
    } catch (err) {
      console.error(`Erro tentando actualizar unha relectura.`, err.message);
      next(err);
    }
  }

  static async deleteRelectura(req, res, next) {
    try {
      if (req.query.id === undefined) {
        return res.status(400).json({ error: 'Falta o parámetro id' });
      }
      res.json(await relecturas.borrarRelectura(req.idUsuario, req.query.id));
    } catch (err) {
      console.error(`Erro tentando eliminar unha relectura.`, err.message);
      next(err);
    }
  }
}

export default RelecturaController;
