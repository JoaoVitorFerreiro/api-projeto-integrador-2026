export class Venda {
  private constructor(
    private readonly id: number,
    private readonly clienteId: number,
    private readonly produtoId: number,
    private readonly quantidade: number,
    private readonly total: number
  ) {}

  // Cria uma nova venda.
  // O total é calculado automaticamente: quantidade * precoUnitario.
  static create(
    clienteId: number,
    produtoId: number,
    quantidade: number,
    precoUnitario: number
  ): Venda {
    if (clienteId <= 0) {
      throw new Error("Cliente inválido");
    }
    if (produtoId <= 0) {
      throw new Error("Produto inválido");
    }
    if (quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }
    if (precoUnitario <= 0) {
      throw new Error("Preço unitário deve ser maior que zero");
    }
    const total = quantidade * precoUnitario;
    return new Venda(0, clienteId, produtoId, quantidade, total);
  }

  // Reconstitui uma venda vinda do banco de dados.
  static reconstituir(
    id: number,
    clienteId: number,
    produtoId: number,
    quantidade: number,
    total: number
  ): Venda {
    return new Venda(id, clienteId, produtoId, quantidade, total);
  }

  getId(): number {
    return this.id;
  }
  getClienteId(): number {
    return this.clienteId;
  }
  getProdutoId(): number {
    return this.produtoId;
  }
  getQuantidade(): number {
    return this.quantidade;
  }
  getTotal(): number {
    return this.total;
  }
}
