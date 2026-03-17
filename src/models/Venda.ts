import { VendaItem } from "./VendaItem";

export interface Venda {
  id?: number;
  clienteId: number;
  total: number;
  itens: VendaItem[];
}
