const express = require('express');
const router = express.Router();
const livros = require('../services/livros');

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  const resultado = {resultado:'Chamada realizada'};
  res.json(resultado);
});


/**
 * GET
 */
router.get('/DadosLivrosParaMovel', async function(req, res, next) {
  try {
    res.json(await livros.getLivrosParaMovel(2));
  } catch (err) {
    console.error(`Erro ao obter os livros `, err.message);
    next(err);
  }
});



// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Ruta para obtener los libros
router.get('/LivrosParaMovel', async function(req, res, next) {
  try {
    const livrosData = await livros.getLivrosParaMovel(2);
    
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Listado de Libros</title>
      <style>
        :root {
          --bg-color: #121212;
          --text-color: #ffffff;
          --border-color: #333333;
          --hover-color: #1e1e1e;
          --input-bg: #2d2d2d;
        }
        
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 15px;
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          color: var(--text-color);
          text-align: center;
          margin-bottom: 20px;
        }
        
        .filters {
          margin-bottom: 20px;
          padding: 15px;
          background-color: var(--input-bg);
          border-radius: 5px;
        }
        
        .filter-group {
          margin-bottom: 10px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        
        input {
          padding: 8px;
          width: 100%;
          max-width: 400px;
          background-color: var(--input-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        th {
          background-color: var(--input-bg);
          position: sticky;
          top: 0;
        }
        
        tr:hover {
          background-color: var(--hover-color);
        }
        
        .summary {
          font-style: italic;
          text-align: center;
          margin-top: 20px;
          color: #aaaaaa;
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          table {
            display: block;
            overflow-x: auto;
          }
          
          th, td {
            padding: 8px;
            font-size: 14px;
          }
          
          .filters {
            padding: 10px;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem;
          }
          
          input {
            max-width: 100%;
          }
        }
      </style>
      <script>
        function filterBooks() {
          const titleFilter = normalizeText(document.getElementById('titleFilter').value);
          const authorFilter = normalizeText(document.getElementById('authorFilter').value);
          
          document.querySelectorAll('tbody tr').forEach(row => {
            const title = normalizeText(row.cells[0].textContent);
            const author = normalizeText(row.cells[4].textContent);
            
            const titleMatch = title.includes(titleFilter);
            const authorMatch = author.includes(authorFilter);
            
            row.style.display = (titleMatch && authorMatch) ? '' : 'none';
          });
        }
        
        function normalizeText(text) {
          return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
      </script>
    </head>
    <body>
      <div class="container">
        <h1>Listado de Libros</h1>
        <div class="filters">
          <div class="filter-group">
            <label for="titleFilter">Filtrar por título:</label>
            <input type="text" id="titleFilter" oninput="filterBooks()" placeholder="Escribe parte del título...">
          </div>
          <div class="filter-group">
            <label for="authorFilter">Filtrar por autor:</label>
            <input type="text" id="authorFilter" oninput="filterBooks()" placeholder="Escribe parte del nombre del autor...">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Páginas</th>
              <th>Idioma</th>
              <th>Fecha Lectura</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    livrosData.data.forEach(libro => {
      const fecha = new Date(libro.dataFimLeitura).toLocaleDateString();
      html += `
            <tr>
              <td>${libro.titulo}</td>
              <td>${libro.paginas}</td>
              <td>${libro.idioma}</td>
              <td>${fecha}</td>
              <td>${libro.nomeAutor}</td>
            </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        <div class="summary">
          Total de libros: ${livrosData.meta.quantidade} | Fecha: ${livrosData.meta.data}
        </div>
      </div>
    </body>
    </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al obtener los libros');
  }
});


module.exports = router;