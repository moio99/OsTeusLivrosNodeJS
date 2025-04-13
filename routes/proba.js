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
    
    // Generar HTML
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Listado de Libros</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .filters { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .filter-group { margin-bottom: 10px; }
        label { display: inline-block; width: 100px; }
        input { padding: 5px; width: 300px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f5f5f5; }
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
    
    // Añadir filas de libros
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
    
    // Cerrar HTML
    html += `
        </tbody>
      </table>
      <div style="margin-top: 20px; font-style: italic;">
        Total de libros: ${livrosData.meta.quantidade} | Fecha: ${livrosData.meta.data}
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