import bibliotecas from '../services/bibliotecas.js';

export class BibliotecaController {
  static async getAll(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await bibliotecas.getBibliotecas(req.idUsuario));
    } catch (err) {
      console.error(`Erro ao obter as bibliotecas `, err.message);
      next(err);
    }
  }

  static async getByNome(req, res, next) {
    try {
      // res.json(await programmingLanguages.getMultiple(req.query.page));
      res.json(await bibliotecas.getBibliotecaPorNome(req.idUsuario, req.query.nome));
    } catch (err) {
      console.error(`Erro ao obter a biblioteca polo nome `, err.message);
      next(err);
    }
  }
}

export default BibliotecaController;
