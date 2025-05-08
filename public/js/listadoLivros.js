// public/js/estadisticas.js
function borrarContido(idDiv) {
  document.getElementById(idDiv).innerHTML = '';
}

async function getLivros() {
  const loadingElement = document.getElementById('carregando');

  try {
    loadingElement.style.display = 'block';
    document.getElementById('aEstadisticas').style.display = 'none';
    const response = await fetch(`/api/paginas/DadosLivros?idUsuario=${idUsuario}&tipo=${idTipo}&chave=${idChave}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success || !data.livros?.length) {
      console.error('Nom se atoparom livros:', error);
      return;
    }
    console.log(data.origemDados, 'origemDados elementos devoltos');
    renderTitulo(data.nomeFiltro, data.origemDados);

    const idiomas = [...new Set(data.livros.map(livro => livro.nomeIdioma))];
    const autores = [...new Set(data.livros.flatMap(livro => 
      livro.autores?.map(autor => autor.nome) || []
    ))];
    
    livros = data.livros;
    renderCombo(idiomas, '#languageFilter');
    renderCombo(autores, '#authorComboFilter');
    renderTaboa(data.livros);
  } catch (error) {
    console.error('Erro ao obter os livros:', error);
  } finally {
    loadingElement.style.display = 'none';
  }
}


function renderTitulo(nomeFiltro, origemDados) {
  const titulo = document.getElementById('titulo');
  switch (idTipo) {
    case '1':
      titulo.innerHTML = `<h3>Livros polo idioma ${nomeFiltro}</h3>`;
      break;
    case '2':
      titulo.innerHTML = `<h3>Livros polo género ${nomeFiltro}</h3>`;
      break;
    case '3':
      titulo.innerHTML = `<h3>Livros polo ano ${nomeFiltro}</h3>`;
      break;
    default:
      titulo.innerHTML = `<h1>Listado de Livros</h1>`;
      document.getElementById('aEstadisticas').style.display = 'block';
      document.getElementById('origemDados').innerText = origemDados;
      break;
  }
}

function renderCombo(data, idCombo) {
const combo = document.querySelector(idCombo);
combo.innerHTML = '<option value="">Todos</option>';

const elementosFiltrados = data.filter(elemento => 
  elemento !== null && elemento !== undefined && elemento.toString().trim() !== ''
);
const elementosOrdenados = [...elementosFiltrados].sort((a, b) => {
  const elementoA = a.toLowerCase();
  const elementoB = b.toLowerCase();
  return elementoA.localeCompare(elementoB);
});

elementosOrdenados.forEach(elemento => {
  const option = new Option(elemento, elemento);
  combo.appendChild(option);
});
}

function renderTaboa(data) {
const tbody = document.querySelector('tbody');
tbody.innerHTML = '';

data.forEach(livro => {
  const dataForma = new Date(livro.dataFimLeitura).toLocaleDateString();
  
  // Fila principal
  const mainRow = document.createElement('tr');
  mainRow.className = 'book-row';
  mainRow.idDoLivr = livro.id;
  mainRow.onclick = () => getDetalhesDoLivro(livro.id);
  
  mainRow.innerHTML = `
    <td>${livro.titulo}</td>
    <td>${livro.paginas}</td>
    <td>${livro.Pontuacom}</td>
    <td class="coluna4">${dataForma}</td>
    <td class="coluna5">${livro.nomeIdioma}</td>
    <td class="coluna6">${livro.nomeAutor}</td>
  `;
  
  tbody.appendChild(mainRow);
  
  // Fila expandible con detalles
  const detailRow = document.createElement('tr');
  detailRow.id = `detalhesId${livro.id}`;
  detailRow.className = 'expanded-row';
                  
  tbody.appendChild(detailRow);
});

// Actualizar contador
document.getElementById('sumario').innerHTML = `
  ${data.length} livro${data.length === 1 ? ' amosado' : 's amosados'} de ${livros.length}
`;
}

function applyFilters() {
const titleFilter = normalizeText(document.getElementById('titleFilter').value);
const authorFilter = normalizeText(document.getElementById('authorFilter').value);
const languageFilter = document.getElementById('languageFilter').value;
const authorComboFilter = document.getElementById('authorComboFilter').value;
const sortField = document.querySelector('input[name="sort"]:checked')?.value || 'titulo';
const sortDirection = document.querySelector('input[name="sortDirection"]:checked')?.value || 'asc';
const radioLidoValor = document.querySelector('input[name="lido"]:checked')?.value || 2;

// Filtrar
let filtered = livros.filter(livro => {
  const titleMatch = normalizeText(livro.titulo).includes(titleFilter);
  const authorMatch = normalizeText(livro.nomeAutor).includes(authorFilter);
  const languageMatch = languageFilter === '' || livro.nomeIdioma === languageFilter;
  const authorComboMatch = authorComboFilter === '' || livro.autores.some(autor => autor.nome === authorComboFilter);
  const lidos = radioLidoValor == 2 ? true : livro.lido == radioLidoValor;
  
  return titleMatch && authorMatch && languageMatch && authorComboMatch && lidos;
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
renderTaboa(filtered);
}

function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function getDetalhesDoLivro(idLivro) {
const detalhesDiv = document.getElementById('detalhesId' + idLivro);
if (detalhesDiv.innerHTML !== '') {
  borrarDetalhes(idLivro);
}
else {
  try {
    document.getElementById('carregando').style.display = 'block';
    const response = await fetch(`/api/Paginas/DetalhesDoLivro?idLivro=${idLivro}`)
      .finally(() => {
        document.getElementById('carregando').style.display = 'none';
      });                
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
getLivros();
});