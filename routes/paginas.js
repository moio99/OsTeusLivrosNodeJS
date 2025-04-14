const express = require('express');
const router = express.Router();
const livros = require('../services/livros');
const fs = require('fs');

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

router.get('/DadosDoLivro', async function(req, res, next) {
  try {
    if (req.query.idLivro) {
      const data = await livros.getLivro(2, req.query.idLivro);
      if (data && data.livro) {
        const livrosData = data.livro;
        console.log(data.livro);
        const htmlContent = `
            <td colspan="6">
              <div class="titulo-detalhes">
                <div>Título Original: ${livrosData.tituloOriginal || "N/A"}</div>
                <div class="botom-fechar" onclick="borrarDetalhes(${data.livro.id})">❌Pechar</div>
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
              <p><strong>Días de lectura:</strong> ${livrosData.diasLeitura}</p>
              <p><strong>Fim de lectura:</strong> ${livrosData.dataFimLeitura}</p>
              <p><strong>Descriçom:</strong> ${livrosData.descricom}</p>
              <p><strong>Comentario:</strong> ${livrosData.comentario}</p>
              <p><strong>Pontuaçom:</strong> ${livrosData.pontuacom}/10</p>
            </td>
        `;

        // Enviar el HTML como respuesta
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


const htmlBasico = `
  <!DOCTYPE html>
  <head><title>Listado de Livros</title></head>
  <body>Listado de Livros</body>
`;

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Rota para obteer os livros para criar o json
router.get('/LivrosParaJson', async function(req, res, next) {
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
              <th>Fim lectura</th>
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

router.get('/Listado', async function(req, res, next) {
  try {
    const livrosData = await livros.getLivrosParaMovel(2);
    
    const idiomas = [...new Set(livrosData.data.map(livro => livro.idioma))];
    const autores = [...new Set(livrosData.data.flatMap(livro => 
      livro.autores.map(autor => autor.nome)
    ))];

    let html = htmlBasico;
    fs.readFile('./pages/listadoLivros.css', 'utf8', (err, contidoCSS) => {
      if (err) {
        console.error('Erro ao obter o arquivo CSS:', err);
      } else { console.log('Tamanho do arquivo CSS:', contidoCSS.length); }
      
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Listado de Livros</title>
          <style>
            ${contidoCSS}
          </style>
          <script>
            let livros = ${JSON.stringify(livrosData.data)};
            let expandedRows = {};
            
            function applyFilters() {
              const titleFilter = normalizeText(document.getElementById('titleFilter').value);
              const authorFilter = normalizeText(document.getElementById('authorFilter').value);
              const languageFilter = document.getElementById('languageFilter').value;
              const authorComboFilter = document.getElementById('authorComboFilter').value;
              const sortField = document.querySelector('input[name="sort"]:checked')?.value || 'titulo';
              const sortDirection = document.querySelector('input[name="sortDirection"]:checked')?.value || 'asc';
              
              // Filtrar
              let filtered = livros.filter(livro => {
                const titleMatch = normalizeText(livro.titulo).includes(titleFilter);
                const authorMatch = normalizeText(livro.nomeAutor).includes(authorFilter);
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
              
              // Actualizar taboa
              renderTable(filtered);
            }

            async function getDetalhesDoLivro(idLivro) {
              const detalhesDiv = document.getElementById('detalhesId' + idLivro);
              if (detalhesDiv.innerHTML !== '') {
                borrarDetalhes(idLivro);
              }
              else {
                try {
                  const response = await fetch(\`/api/Paginas/DadosDoLivro?idLivro=\${idLivro}\`);                
                  if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
                  
                  const htmlContent = await response.text();
                  if (detalhesDiv) {
                    detalhesDiv.innerHTML = htmlContent;
                  } else {
                    console.error('Nom se atopou o div com o id detalhesId' + idLivro); 
                    alert('Nom se encontró el div com o id detalhesId' + idLivro);
                  }
                  
                } catch (error) {
                  console.error('Erro ao obter os detalhes:', error);
                  alert('Erro ao obter os detalhes do livro');
                }
              }
            }
            
            function borrarDetalhes(idLivro) {
              const detalhesDiv = document.getElementById('detalhesId' + idLivro);
              detalhesDiv.innerHTML = '';
            }

            function renderTable(data) {
              const tbody = document.querySelector('tbody');
              tbody.innerHTML = '';
              
              data.forEach(livro => {
                const dataForma = new Date(livro.dataFimLeitura).toLocaleDateString();
                
                // Fila principal
                const mainRow = document.createElement('tr');
                mainRow.className = 'book-row';
                mainRow.idDoLivr = livro.id;
                mainRow.onclick = () => getDetalhesDoLivro(livro.id);
                
                mainRow.innerHTML = \`
                  <td>\${livro.titulo}</td>
                  <td>\${livro.paginas}</td>
                  <td>\${livro.Pontuacom}</td>
                  <td class="coluna4">\${dataForma}</td>
                  <td class="coluna5">\${livro.idioma}</td>
                  <td class="coluna6">\${livro.nomeAutor}</td>
                \`;
                
                tbody.appendChild(mainRow);
                
                // Fila expandible con detalles
                const detailRow = document.createElement('tr');
                detailRow.id = \`detalhesId\${livro.id}\`;
                detailRow.className = 'expanded-row';
                                
                tbody.appendChild(detailRow);
              });
              
              // Actualizar contador
              document.querySelector('.summary').innerHTML = \`
                livros amosados: \${data.length} de \${livros.length} | Data: \${new Date().toLocaleDateString()}
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
                <div>
                  <label for="titleFilter">Filtrar polo título:</label>
                  <input type="text" id="titleFilter" oninput="applyFilters()" placeholder="Escrebe parte do título...">
                </div>
                <div>
                  <label for="authorFilter">Filtrar polo autor:</label>
                  <input type="text" id="authorFilter" oninput="applyFilters()" placeholder="Escrebe parte do nome do autor...">
                </div>
              </div>
              <div class="filter-group">
                <div>
                  <label for="languageFilter">Idioma:</label>
                  <select id="languageFilter" onchange="applyFilters()">
                    <option value="">Todos os idiomas</option>
                    ${idiomas.map(idioma => `<option value="${idioma}">${idioma}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="authorComboFilter">Autor:</label>
                  <select id="authorComboFilter" onchange="applyFilters()">
                    <option value="">Todos os autores</option>
                    ${autores.map(autor => `<option value="${autor}">${autor}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
            
            <div class="sort-options">
              <h4>Ordenar polo:</h4>
              <div class="sort-option">
                <div class="radio-group">
                  <label for="sortTitle">Título</label>
                  <input type="radio" id="sortTitle" name="sort" value="titulo" checked="" onchange="applyFilters()">
                </div>
                <div class="radio-group">
                  <label for="sortDate">Data de lectura</label>
                  <input type="radio" id="sortDate" name="sort" value="dataFimLeitura" onchange="applyFilters()">
                </div>
                <div class="radio-group">
                  <label for="sortPages">Páginas</label>
                  <input type="radio" id="sortPages" name="sort" value="paginas" onchange="applyFilters()">
                </div>
                <div class="radio-group">
                  <label for="sortRating">Pontuaçom</label>
                  <input type="radio" id="sortRating" name="sort" value="Pontuacom" onchange="applyFilters()">
                </div>
              </div>              
              <div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                <div class="sort-option">
                  <div class="radio-group">
                    <label for="sortAsc">Ascendente</label>
                    <input type="radio" id="sortAsc" name="sortDirection" value="asc" checked="" onchange="applyFilters()">
                  </div>
                  <div class="radio-group">
                    <label for="sortDesc">Descendente</label>
                    <input type="radio" id="sortDesc" name="sortDirection" value="desc" onchange="applyFilters()">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="summary">
              livros amosados: ${livrosData.data.length} de ${livrosData.data.length} | Data: ${livrosData.meta.data}
            </div>
            
            <table style="margin-top: 10px;">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Páginas</th>
                  <th>Pontuaçom</th>
                  <th class="coluna4">Fim lectura</th>
                  <th class="coluna5">Idioma</th>
                  <th class="coluna6">Autor</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </body>
        </html>
      `;
        res.send(html);
    });
    
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obtene os livros');
  }
});

module.exports = router;