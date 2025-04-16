const express = require('express');
const router = express.Router();
const livros = require('../services/livros');
const fs = require('fs');

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

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

router.get('/Listado', async function(req, res, next) {
  try {
    const livrosData = await livros.getLivrosParaMovel(2);
    
    const idiomas = [...new Set(livrosData.data.map(livro => livro.idioma))];
    const autores = [...new Set(livrosData.data.flatMap(livro => 
      livro.autores.map(autor => autor.nome)
    ))];

    let gifCarregando = '';
    fs.readFile('./pages/carregando.txt', 'utf8', (err, gifCarregando) => {
      if (err) {
        console.error('Erro ao obter o arquivo imagem.txt:', err);
        gifCarregando = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';
      } else { 
        console.log('Tamanho do arquivo imagem.txt:', gifCarregando.length);

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
                      document.getElementById('carregando').style.display = 'block';
                      const response = await fetch(\`/api/Paginas/DadosDoLivro?idLivro=\${idLivro}\`)
                        .finally(() => {
                          document.getElementById('carregando').style.display = 'none';
                        });                
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
                    \${data.length} livros amosados de \${livros.length} | Data: \${new Date().toLocaleDateString()}
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
                <img id="carregando" src="${gifCarregando}" alt="Carregando...">
                <a href="/api/paginas/Proba">Proba</a>
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
                  ${livrosData.data.length} livros do total ${livrosData.data.length} | Data: ${livrosData.meta.data}
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
      
      }
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao obtene os livros');
  }
});

module.exports = router;