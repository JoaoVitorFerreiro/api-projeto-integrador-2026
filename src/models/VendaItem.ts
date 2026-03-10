export class VendaItem {
  private constructor(
    private readonly id: number,
    private readonly vendaId: number,
    private readonly produtoId: number,
    private readonly quantidade: number,
    private readonly precoUnitario: number,
    private readonly subtotal: number
  ) {}

  static create(vendaId: number, produtoId: number, quantidade: number, precoUnitario: number): VendaItem {
    return new VendaItem(0, vendaId, produtoId, quantidade, precoUnitario, quantidade * precoUnitario);
  }

  static reconstituir(
    id: number,
    vendaId: number,
    produtoId: number,
    quantidade: number,
    precoUnitario: number,
    subtotal: number
  ): VendaItem {
    return new VendaItem(id, vendaId, produtoId, quantidade, precoUnitario, subtotal);
  }

  getId(): number {
    return this.id;
  }
  getVendaId(): number {
    return this.vendaId;
  }
  getProdutoId(): number {
    return this.produtoId;
  }
  getQuantidade(): number {
    return this.quantidade;
  }
  getPrecoUnitario(): number {
    return this.precoUnitario;
  }
  getSubtotal(): number {
    return this.subtotal;
  }
}
