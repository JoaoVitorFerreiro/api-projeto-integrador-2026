export class Produto {
  private constructor(
    private readonly id: number,
    private readonly nome: string,
    private readonly preco: number
  ) {}

  // Cria um novo produto com validações.
  static create(nome: string, preco: number): Produto {
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }
    if (preco <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }
    return new Produto(0, nome.trim(), preco);
  }

  // Reconstitui um produto vindo do banco de dados.
  static reconstituir(id: number, nome: string, preco: number): Produto {
    return new Produto(id, nome, preco);
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
}
