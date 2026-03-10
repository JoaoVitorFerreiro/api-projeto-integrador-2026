import { VendaItem } from "./VendaItem";

export class Venda {
  private constructor(
    private readonly id: number,
    private readonly clienteId: number,
    private readonly itens: VendaItem[],
    private readonly total: number
  ) {}

  static create(clienteId: number, itens: VendaItem[]): Venda {
    if (clienteId <= 0) {
      throw new Error("Cliente inválido");
    }
    if (itens.length === 0) {
      throw new Error("A venda deve ter ao menos um item");
    }
    const total = itens.reduce((acc, item) => acc + item.getSubtotal(), 0);
    return new Venda(0, clienteId, itens, total);
  }

  static reconstituir(id: number, clienteId: number, itens: VendaItem[], total: number): Venda {
    return new Venda(id, clienteId, itens, total);
  }

  getId(): number {
    return this.id;
  }
  getClienteId(): number {
    return this.clienteId;
  }
  getItens(): VendaItem[] {
    return this.itens;
  }
  getTotal(): number {
    return this.total;
  }
}
