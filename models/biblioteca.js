class ElementoId {
  constructor(row) {
    this.id = row.id;
  }
}

class Biblioteca extends ElementoId {
  constructor(row) {
    super(row);
    this.nome = row.nome;
    this.datarenovacom = row.datarenovacom; 
  }
}

class BibliotecaCosLivros extends Biblioteca {
  constructor(row) {
    super(row);
    this.quantidadeLivros = row.quantidadeLivros;
  }
}

class BibliotecaDetalhe extends Biblioteca {
  constructor(row) {
    super(row);
    this.endereco = row.endereco;
    this.localidade = row.localidade;
    this.telefone = row.telefone;
    this.dataasociamento = row.dataasociamento;
    this.comentario = row.comentario;
  }
}

export default{ ElementoId, Biblioteca, BibliotecaCosLivros, BibliotecaDetalhe };