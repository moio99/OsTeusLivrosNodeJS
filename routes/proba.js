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
      <title>Listado de Livros</title>
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
        <h1>Listado de Livros</h1>
        <div class="filters">
          <div class="filter-group">
            <label for="titleFilter">Filtrar polo título:</label>
            <input type="text" id="titleFilter" oninput="filterBooks()" placeholder="Escrebe parte do título...">
          </div>
          <div class="filter-group">
            <label for="authorFilter">Filtrar polo autor:</label>
            <input type="text" id="authorFilter" oninput="filterBooks()" placeholder="Escrebe parte do nome do autor...">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Páginas</th>
              <th>Idioma</th>
              <th>Data Lectura</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    livrosData.data.forEach(libro => {
      const dataForma = new Date(libro.dataFimLeitura).toLocaleDateString();
      html += `
            <tr>
              <td>${libro.titulo}</td>
              <td>${libro.paginas}</td>
              <td>${libro.idioma}</td>
              <td>${dataForma}</td>
              <td>${libro.nomeAutor}</td>
            </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        <div class="summary">
          Total de Livros: ${livrosData.meta.quantidade} | Data: ${livrosData.meta.data}
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


router.get('/LivrosParaMovelCombos', async function(req, res, next) {
  try {
    const livrosData = await livros.getLivrosParaMovel(2);
    
    const idiomas = [...new Set(livrosData.data.map(libro => libro.idioma))];
    const autores = [...new Set(livrosData.data.flatMap(libro => 
      libro.autores.map(autor => autor.nome)
    ))];
    
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Listado de Livros</title>
      <style>
        :root {
          --bg-color: #121212;
          --text-color: #ffffff;
          --border-color: #333333;
          --hover-color: #1e1e1e;
          --input-bg: #2d2d2d;
          --accent-color: #4a6fa5;
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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .filter-group {
          margin-bottom: 10px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        
        input, select {
          padding: 8px;
          width: 100%;
          background-color: var(--input-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        .sort-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
          padding: 10px;
          background-color: var(--input-bg);
          border-radius: 4px;
        }
        
        .sort-option {
          display: flex;
          align-items: center;
          gap: 8px;
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
          cursor: pointer;
        }
        
        th:hover {
          background-color: var(--hover-color);
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
          .filters {
            grid-template-columns: 1fr;
          }
          
          table {
            display: block;
            overflow-x: auto;
          }
          
          th, td {
            padding: 8px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem;
          }
        }
      </style>
      <script>
        let libros = ${JSON.stringify(livrosData.data)};
        
        function applyFilters() {
          const titleFilter = normalizeText(document.getElementById('titleFilter').value);
          const authorFilter = normalizeText(document.getElementById('authorFilter').value);
          const languageFilter = document.getElementById('languageFilter').value;
          const authorComboFilter = document.getElementById('authorComboFilter').value;
          const sortField = document.querySelector('input[name="sort"]:checked')?.value || 'titulo';
          const sortDirection = document.querySelector('input[name="sortDirection"]:checked')?.value || 'asc';
          
          // Filtrar
          let filtered = libros.filter(libro => {
            const titleMatch = normalizeText(libro.titulo).includes(titleFilter);
            const authorMatch = normalizeText(libro.nomeAutor).includes(authorFilter);
            const languageMatch = languageFilter === '' || livro.idioma === languageFilter;
            const authorComboMatch = authorComboFilter === '' || 
              livro.autores.some(autor => autor.nome === authorComboFilter);
            
            return titleMatch && authorMatch && languageMatch && authorComboMatch;
          });
          
          // Ordenar
          filtered.sort((a, b) => {
            let valA, valB;
            
            if (sortField === 'dataFimLeitura') {
              valA = new Date(a.dataFimLeitura).getTime();
              valB = new Date(b.dataFimLeitura).getTime();
            } else if (sortField === 'paginas') {
              valA = a.paginas;
              valB = b.paginas;
            } else if (sortField === 'Pontuacom') {
              valA = a.Pontuacom;
              valB = b.Pontuacom;
            } else {
              valA = a[sortField].toLowerCase();
              valB = b[sortField].toLowerCase();
            }
            
            return sortDirection === 'asc' ? 
              (valA > valB ? 1 : -1) : 
              (valA < valB ? 1 : -1);
          });
          
          // Actualizar tabla
          renderTable(filtered);
        }
        
        function renderTable(data) {
          const tbody = document.querySelector('tbody');
          tbody.innerHTML = '';
          
          data.forEach(libro => {
            const dataForma = new Date(libro.dataFimLeitura).toLocaleDateString();
            const row = document.createElement('tr');
            
            row.innerHTML = \`
              <td>\${libro.titulo}</td>
              <td>\${libro.paginas}</td>
              <td>\${libro.idioma}</td>
              <td>\${dataForma}</td>
              <td>\${libro.Pontuacom}</td>
              <td>\${libro.nomeAutor}</td>
            \`;
            
            tbody.appendChild(row);
          });
          
          // Actualizar contador
          document.querySelector('.summary').innerHTML = \`
            livros amosados: \${data.length} de \${libros.length} | Data: \${new Date().toLocaleDateString()}
          \`;
        }
        
        function normalizeText(text) {
          return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
        
        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
          applyFilters();
        });
      </script>
    </head>
    <body>
      <div class="container">
        <h1>Listado de Livros</h1>
        <div class="filters">
          <div class="filter-group">
            <label for="titleFilter">Filtrar polo título:</label>
            <input type="text" id="titleFilter" oninput="applyFilters()" placeholder="Escrebe parte do título...">
          </div>
          <div class="filter-group">
            <label for="authorFilter">Filtrar polo autor:</label>
            <input type="text" id="authorFilter" oninput="applyFilters()" placeholder="Escrebe parte do nome do autor...">
          </div>
          <div class="filter-group">
            <label for="languageFilter">Idioma:</label>
            <select id="languageFilter" onchange="applyFilters()">
              <option value="">Todos os idiomas</option>
              ${idiomas.map(idioma => `<option value="${idioma}">${idioma}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label for="authorComboFilter">Autor (lista):</label>
            <select id="authorComboFilter" onchange="applyFilters()">
              <option value="">Todos os autores</option>
              ${autores.map(autor => `<option value="${autor}">${autor}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="sort-options">
          <h3>Ordenar polo:</h3>
          <div class="sort-option">
            <input type="radio" id="sortTitle" name="sort" value="titulo" checked onchange="applyFilters()">
            <label for="sortTitle">Título</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortDate" name="sort" value="dataFimLeitura" onchange="applyFilters()">
            <label for="sortDate">Data de lectura</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortPages" name="sort" value="paginas" onchange="applyFilters()">
            <label for="sortPages">Páginas</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortRating" name="sort" value="Pontuacom" onchange="applyFilters()">
            <label for="sortRating">Pontuaçom</label>
          </div>
          
          <div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <div class="sort-option">
              <input type="radio" id="sortAsc" name="sortDirection" value="asc" checked onchange="applyFilters()">
              <label for="sortAsc">Ascendente</label>
            </div>
            <div class="sort-option">
              <input type="radio" id="sortDesc" name="sortDirection" value="desc" onchange="applyFilters()">
              <label for="sortDesc">Descendente</label>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Páginas</th>
              <th>Idioma</th>
              <th>Data Lectura</th>
              <th>Pontuaçom</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="summary">
          livros amosados: ${livrosData.data.length} de ${livrosData.data.length} | Data: ${livrosData.meta.data}
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

router.get('/LivrosParaMovelAmpliado', async function(req, res, next) {
  try {
    const livrosData = await livros.getLivrosParaMovel(2);
    
    const idiomas = [...new Set(livrosData.data.map(libro => libro.idioma))];
    const autores = [...new Set(livrosData.data.flatMap(libro => 
      libro.autores.map(autor => autor.nome)
    ))];

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Listado de Livros</title>
      <style>
        :root {
          --bg-color: #121212;
          --text-color: #ffffff;
          --border-color: #333333;
          --hover-color: #1e1e1e;
          --input-bg: #2d2d2d;
          --accent-color: #4a6fa5;
          --expand-bg: #252525;
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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .filter-group {
          margin-bottom: 10px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        
        input, select {
          padding: 8px;
          width: 100%;
          background-color: var(--input-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        .sort-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
          padding: 10px;
          background-color: var(--input-bg);
          border-radius: 4px;
        }
        
        .sort-option {
          display: flex;
          align-items: center;
          gap: 8px;
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
          cursor: pointer;
        }
        
        .book-row {
          cursor: pointer;
        }
        
        .book-row:hover {
          background-color: var(--hover-color);
        }
        
        .expanded-row {
          background-color: var(--expand-bg);
        }
        
        .expanded-content {
          display: none;
          padding: 15px;
          grid-column: 1 / -1;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .detail-item {
          margin-bottom: 10px;
        }
        
        .detail-label {
          font-weight: bold;
          color: var(--accent-color);
          margin-right: 5px;
        }
        
        .summary {
          font-style: italic;
          text-align: center;
          margin-top: 20px;
          color: #aaaaaa;
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .filters {
            grid-template-columns: 1fr;
          }
          
          table {
            display: block;
            overflow-x: auto;
          }
          
          th, td {
            padding: 8px;
            font-size: 14px;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <script>
        let libros = ${JSON.stringify(livrosData.data)};
        let expandedRows = {};
        
        function applyFilters() {
          const titleFilter = normalizeText(document.getElementById('titleFilter').value);
          const authorFilter = normalizeText(document.getElementById('authorFilter').value);
          const languageFilter = document.getElementById('languageFilter').value;
          const authorComboFilter = document.getElementById('authorComboFilter').value;
          const sortField = document.querySelector('input[name="sort"]:checked')?.value || 'titulo';
          const sortDirection = document.querySelector('input[name="sortDirection"]:checked')?.value || 'asc';
          
          // Filtrar
          let filtered = libros.filter(libro => {
            const titleMatch = normalizeText(libro.titulo).includes(titleFilter);
            const authorMatch = normalizeText(libro.nomeAutor).includes(authorFilter);
            const languageMatch = languageFilter === '' || livro.idioma === languageFilter;
            const authorComboMatch = authorComboFilter === '' || 
              livro.autores.some(autor => autor.nome === authorComboFilter);
            
            return titleMatch && authorMatch && languageMatch && authorComboMatch;
          });
          
          // Ordenar
          filtered.sort((a, b) => {
            let valA, valB;
            
            if (sortField === 'dataFimLeitura') {
              valA = new Date(a.dataFimLeitura).getTime();
              valB = new Date(b.dataFimLeitura).getTime();
            } else if (sortField === 'paginas') {
              valA = a.paginas;
              valB = b.paginas;
            } else if (sortField === 'Pontuacom') {
              valA = a.Pontuacom;
              valB = b.Pontuacom;
            } else {
              valA = a[sortField].toLowerCase();
              valB = b[sortField].toLowerCase();
            }
            
            return sortDirection === 'asc' ? 
              (valA > valB ? 1 : -1) : 
              (valA < valB ? 1 : -1);
          });
          
          // Actualizar tabla
          renderTable(filtered);
        }
        
        function toggleRow(id) {
          const row = document.getElementById(\`detail-\${id}\`);
          if (row.style.display === 'table-row') {
            row.style.display = 'none';
            expandedRows[id] = false;
          } else {
            row.style.display = 'table-row';
            expandedRows[id] = true;
          }
        }
        
        function renderTable(data) {
          const tbody = document.querySelector('tbody');
          tbody.innerHTML = '';
          
          data.forEach(libro => {
            const dataForma = new Date(libro.dataFimLeitura).toLocaleDateString();
            
            // Fila principal
            const mainRow = document.createElement('tr');
            mainRow.className = 'book-row';
            mainRow.onclick = () => toggleRow(libro.id);
            
            mainRow.innerHTML = \`
              <td>\${libro.titulo}</td>
              <td>\${libro.paginas}</td>
              <td>\${libro.idioma}</td>
              <td>\${dataForma}</td>
              <td>\${libro.Pontuacom}</td>
              <td>\${libro.nomeAutor}</td>
            \`;
            
            tbody.appendChild(mainRow);
            
            // Fila expandible con detalles
            const detailRow = document.createElement('tr');
            detailRow.id = \`detail-\${libro.id}\`;
            detailRow.className = 'expanded-row';
            detailRow.style.display = 'none';
            
            detailRow.innerHTML = \`
              <td colspan="6">
                <div class="expanded-content">
                  <div class="details-grid">
                    <div class="detail-item">
                      <span class="detail-label">ID:</span>
                      <span>\${libro.id}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Título original:</span>
                      <span>\${libro.tituloOriginal || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Idioma original:</span>
                      <span>\${libro.idiomaOriginal || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Electrónico:</span>
                      <span>\${libro.Electronico ? 'Sí' : 'No'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Parte de serie:</span>
                      <span>\${libro.SomSerie ? 'Sí' : 'No'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Premios:</span>
                      <span>\${libro.Premios || 'Ninguno'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Descripción:</span>
                      <p>\${libro.Descricom || 'No disponible'}</p>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Comentario:</span>
                      <p>\${libro.Comentario || 'No disponible'}</p>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Cantidad en serie:</span>
                      <span>\${libro.quantidadeSerie}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Relecturas:</span>
                      <span>\${libro.quantidadeRelecturas}</span>
                    </div>
                  </div>
                </div>
              </td>
            \`;
            
            tbody.appendChild(detailRow);
            
            // Restaurar estado expandido si estaba previamente abierto
            if (expandedRows[libro.id]) {
              detailRow.style.display = 'table-row';
            }
          });
          
          // Actualizar contador
          document.querySelector('.summary').innerHTML = \`
            livros amosados: \${data.length} de \${libros.length} | Data: \${new Date().toLocaleDateString()}
          \`;
        }
        
        function normalizeText(text) {
          return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }
        
        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
          applyFilters();
        });
      </script>
    </head>
    <body>
      <div class="container">
        <h1>Listado de Livros</h1>
        <div class="filters">
          <div class="filter-group">
            <label for="titleFilter">Filtrar polo título:</label>
            <input type="text" id="titleFilter" oninput="applyFilters()" placeholder="Escrebe parte do título...">
          </div>
          <div class="filter-group">
            <label for="authorFilter">Filtrar polo autor:</label>
            <input type="text" id="authorFilter" oninput="applyFilters()" placeholder="Escrebe parte do nome do autor...">
          </div>
          <div class="filter-group">
            <label for="languageFilter">Idioma:</label>
            <select id="languageFilter" onchange="applyFilters()">
              <option value="">Todos os idiomas</option>
              ${idiomas.map(idioma => `<option value="${idioma}">${idioma}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label for="authorComboFilter">Autor (lista):</label>
            <select id="authorComboFilter" onchange="applyFilters()">
              <option value="">Todos os autores</option>
              ${autores.map(autor => `<option value="${autor}">${autor}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="sort-options">
          <h3>Ordenar polo:</h3>
          <div class="sort-option">
            <input type="radio" id="sortTitle" name="sort" value="titulo" checked onchange="applyFilters()">
            <label for="sortTitle">Título</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortDate" name="sort" value="dataFimLeitura" onchange="applyFilters()">
            <label for="sortDate">Data de lectura</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortPages" name="sort" value="paginas" onchange="applyFilters()">
            <label for="sortPages">Páginas</label>
          </div>
          <div class="sort-option">
            <input type="radio" id="sortRating" name="sort" value="Pontuacom" onchange="applyFilters()">
            <label for="sortRating">Pontuaçom</label>
          </div>
          
          <div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <div class="sort-option">
              <input type="radio" id="sortAsc" name="sortDirection" value="asc" checked onchange="applyFilters()">
              <label for="sortAsc">Ascendente</label>
            </div>
            <div class="sort-option">
              <input type="radio" id="sortDesc" name="sortDirection" value="desc" onchange="applyFilters()">
              <label for="sortDesc">Descendente</label>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Páginas</th>
              <th>Idioma</th>
              <th>Data Lectura</th>
              <th>Pontuaçom</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="summary">
          livros amosados: ${livrosData.data.length} de ${livrosData.data.length} | Data: ${livrosData.meta.data}
        </div>
      </div>
    </body>
    </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obtene os livros');
  }
});

module.exports = router;