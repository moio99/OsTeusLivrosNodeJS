import express from 'express';
const router = express.Router();
import estadisticas from '../../services/estadisticas.js';
// const fs = require('fs');
import fs from 'fs/promises';

// http://localhost:5002/api/paginas/estadisticas/
router.get('/', async function(req, res, next) {
  const resultado = {resultado:'Chamada realizada em estadisticas'};
  res.json(resultado);
});

// http://localhost:5002/api/paginas/estadisticas/Estadisticas?idUsuario=2
router.get('/Estadisticas', async function(req, res, next) {
  try {
    const idUsuario = req.query.idUsuario;

    // Ler a plantilha HTML
    let htmlPagina;
    try {
      htmlPagina = await fs.readFile('./views/estadisticas.html', 'utf8');
    } catch (err) {
      console.error('Erro ao carregar htmlPagina:', err);
      return res.status(500).send('Erro interno');
    }
    
    // Reemplazar os placeholders
    const html = htmlPagina
      .replaceAll('--AidUsuarioA--', idUsuario);

    res.send(html);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obter as estadísticas');
  }
});

router.get('/DadosEstadisticas', async function(req, res, next) {
  try {
    const resultado = await estadisticas.getEstadisticas(req.query.idUsuario, req.query.tipo);
    if (resultado === '' && !resultado.data) {
      res.statusMessage = `O tipo ${req.query.tipo} nom é um dos válidos`
      res.status(404).end()
    }
    else {
      const html = resultado.data.map(element => {
        return `
            <div>
              <a href="/api/paginas/taboa/ListadoLivros?idUsuario=${req.query.idUsuario}&tipo=${req.query.tipo}&chave=${element.id}">
                <strong>${element.nome}</strong></a> livros: ${element.quantidade} páginas: ${element.quantidadepaginas}
            </div>
          `;
      }).join('');    // Para que nom componha umha matriz
      
      res.send(`
        <div class="contedor-principal">
          <div class="coluna-esquerda">
            ${html}
          </div>
          <div class="coluna-dereita botomFechar">
            <span>${resultado.meta.origemDados}</span>
            <div class="botom-fechar" onclick="borrarContido('${req.query.idDiv}')">❌Pechar</div>
          </div>
        </div>`
      );
    }
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
});

export default router;
