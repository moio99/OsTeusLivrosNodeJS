// public/js/estadisticas.js
function borrarContido(idDiv) {
  document.getElementById(idDiv).innerHTML = '';
}

async function getEstadisticas(tipo, idDiv) {
  const divCarregarDados = document.getElementById(idDiv);
  if (divCarregarDados.innerHTML !== '') {
    borrarContido(idDiv);
  }
  else {
    try {
      document.getElementById('carregando').style.display = 'block';
      const response = await fetch(`/api/paginas/DadosEstadisticas?idUsuario=${idUsuario}&tipo=${tipo}&idDiv=${idDiv}`)
        .finally(() => {
          document.getElementById('carregando').style.display = 'none';
        });                
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      if (divCarregarDados) {
        divCarregarDados.innerHTML = await response.text();
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
                        
// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  getEstadisticas('1', 'livrosPorIdioma');
});