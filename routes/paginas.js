const express = require('express');
const router = express.Router();
const livros = require('../services/livros');
const estadisticas = require('../services/estadisticas');
// const fs = require('fs');
const fs = require('fs').promises;

router.get('/', async function(req, res, next) {
  const resultado = {resultado:'Chamada realizada'};
  res.json(resultado);
});

const htmlBasico = `
  <!DOCTYPE html>
  <head><title>Listado de Livros</title></head>
  <body>Listado de Livros</body>
`;

router.get('/Proba', async function(req, res, next) {
  res.send(htmlBasico);
});

router.get('/ListadoLivros', async function(req, res, next) {
  try {
    const { idUsuario, tipo, chave } = req.query;

    // Ler a plantilha HTML
    let htmlPagina;
    try {
      htmlPagina = await fs.readFile('./views/listadoLivros.html', 'utf8');
    } catch (err) {
      console.error('Erro ao carregar htmlPagina:', err);
      return res.status(500).send('Erro interno');
    }
    
    // Reemplazar os placeholders
    const html = htmlPagina
      .replace('--idUsuario--', idUsuario)
      .replace('--tipo--', tipo)
      .replace('--chave--', chave)
      .replace('--AidUsuarioA--', idUsuario);

    res.send(html);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obter o listado de livros');
  }
});

router.get('/DadosLivros', async function(req, res, next) {
  const { idUsuario, tipo, chave } = req.query;  
  if (!idUsuario || !tipo) return res.status(400).json({ error: 'Faltam parámetros requeridos' });

  try {
    let livrosData;
    switch (tipo) {
      case '0':
        livrosData = await livros.getLivrosParaListadoMovel(idUsuario);
        break;
      case '1':
        livrosData = await livros.getLivrosPorIdioma(idUsuario, chave);
        break;
      case '2':
        livrosData = await livros.getLivrosPorGenero(idUsuario, chave);
        break;
      case '3':
        livrosData = await livros.getLivrosPorAno(idUsuario, chave);
        break;
    }
    if (!livrosData?.data?.length) {
      return res.status(404).json({ 
        message: `Para o tipo ${tipo} nom se obtiveron dados`,
        data: []
      });
    }

    res.json({
      success: true,
      livros: livrosData.data,
      origemDados: livrosData.meta.origemDados
    });
  } catch (err) {
    console.error(`Erro ao obter os DadosLivros:`, err);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: err.message 
    });
  }
});

router.get('/DetalhesDoLivro', async function(req, res, next) {
  try {
    if (req.query.idLivro) {
      const dados = await livros.getLivro(2, req.query.idLivro);
      if (dados && dados.data && dados.data.length > 0) {
        const livrosData = dados.data[0];
        const htmlContent = `
            <td colspan="6">
              <div class="titulo-detalhes">
                <div>Título Original: ${livrosData.tituloOriginal || "N/A"}</div>
                <div class="botom-fechar" onclick="borrarDetalhes(${dados.data[0].id})">❌Pechar</div>
              </div>
              <p><strong>Autores:</strong> ${livrosData.autores.map(autor => autor.nome).join(", ")}</p>
              <p><strong>Géneros:</strong> ${livrosData.generos.map(genero => genero.nome).join(", ")}</p>
              <p><strong>Editorial:</strong> ${livrosData.editorial || "N/A"}</p>
              ${livrosData.electronico ? "<p><strong>Livro electrónico</strong></p>" : ""}
              <p><strong>Biblioteca:</strong> ${livrosData.biblioteca || "N/A"}</p>
              <p><strong>ISBN:</strong> ${livrosData.isbn}</p>
              <p><strong>Estilo:</strong> ${livrosData.estilo}</p>
              ${livrosData.premios ? "<p><strong>Premios: </strong>" + livrosData.premios + "</p>" : ""}
              <p><strong>Páginas:</strong> ${livrosData.paginas}</p>
              <p><strong>Días da lectura:</strong> ${livrosData.diasLeitura}</p>
              <p><strong>Lido:</strong>
                ${livrosData.lido ? "sim <strong>Fim da lectura:</strong> " + livrosData.dataFimLeitura : "nom" }</p>
              <p><strong>Descriçom:</strong> ${livrosData.descricom}</p>
              <p><strong>Comentario:</strong> ${livrosData.comentario}</p>
              <p><strong>Pontuaçom:</strong> ${livrosData.pontuacom}/10</p>
            </td>
        `;

        // Enviar o HTML como resposta
        res.send(htmlContent);
      }else {
        return res.status(402).json({
          error: 'Nom chegou se obtiverom dados'
        });
      }

    } else {
      return res.status(401).json({
        error: 'Nom chegou o id do livro'
      });
    }
  } catch (err) {
    console.error(`Erro ao obter os livros:`, err.message);
    next(err);
  }
});

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
      .replace('--idUsuario--', idUsuario);

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
              <a href="/api/paginas/ListadoLivros?idUsuario=${req.query.idUsuario}&tipo=${req.query.tipo}&chave=${element.id}">
                <strong>${element.nome}</strong></a> livros: ${element.quantidade} páginas: ${element.quantidadepaginas}
            </div>
          `;
      }).join('');    // Para que nom componha umha matriz
      
      res.send(`
        <div class="botomFechar">
          <span>${resultado.meta.origemDados}</span>
          <div class="botom-fechar" onclick="borrarContido('${req.query.idDiv}')">❌Pechar</div>
        </div>
        ${html}`
      );
    }
  } catch (err) {
    console.error(`Erro ao obter as estadísticas `, err.message);
    next(err);
  }
});

module.exports = router;