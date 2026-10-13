import graficos from '../services/graficos.js';

export class GraficoController {
  static async getPaginasPorIdiomaEAno(req, res, next) {
    try {
      res.json(await graficos.getPaginasPorIdiomaEAno(req.idUsuario, req.query.tipo));
    } catch (err) {
      console.error(`Erro ao obter os datos do grafico de paxinas por idioma e ano`, err.message);
      next(err);
    }
  }
}

export default GraficoController;
