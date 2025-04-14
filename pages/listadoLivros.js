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