export class Produto {
  private constructor(
    private readonly id: number,
    private readonly nome: string,
    private readonly preco: number,
    private readonly estoque: number
  ) {}

  static create(nome: string, preco: number, estoque: number): Produto {
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }
    if (preco <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }
    if (estoque < 0) {
      throw new Error("Estoque não pode ser negativo");
    }
    return new Produto(0, nome.trim(), preco, estoque);
  }

  static reconstituir(id: number, nome: string, preco: number, estoque: number): Produto {
    return new Produto(id, nome, preco, estoque);
  }

  reduzirEstoque(quantidade: number): Produto {
    if (quantidade > this.estoque) {
      throw new Error(`Estoque insuficiente para "${this.nome}". Disponível: ${this.estoque}`);
    }
    return new Produto(this.id, this.nome, this.preco, this.estoque - quantidade);
  }

  getId(): number {
    return this.id;
  }
  getNome(): string {
    return this.nome;
  }
  getPreco(): number {
    return this.preco;
  }
  getEstoque(): number {
    return this.estoque;
  }
}
