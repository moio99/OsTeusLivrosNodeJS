import estadisticas from '../services/estadisticas.js';

export class EstadisticasController {
  static async getAll(req, res, next) {
  try {
    const resultado = await estadisticas.getEstadisticas(req.idUsuario, req.query.tipo);
    if (resultado === '') {
      res.statusMessage = `O tipo ${req.query.tipo} nom é um dos válidos`
      res.status(400).end()
    }
    else 
      res.json(resultado);
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
  }
}

export default EstadisticasController;
  