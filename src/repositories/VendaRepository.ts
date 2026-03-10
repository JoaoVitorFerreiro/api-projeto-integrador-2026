import db from "../database/database";
import { Venda } from "../models/Venda";

type VendaRow = {
  id: number;
  cliente_id: number;
  produto_id: number;
  quantidade: number;
  total: number;
};

export interface IVendaRepository {
  salvar(venda: Venda): Venda;
  listar(): Venda[];
}


export class VendaRepository implements IVendaRepository {
  salvar(venda: Venda): Venda {
    const query = db.prepare(
      "INSERT INTO vendas (cliente_id, produto_id, quantidade, total) VALUES (?, ?, ?, ?)"
    );
    const resultado = query.run(
      venda.getClienteId(),
      venda.getProdutoId(),
      venda.getQuantidade(),
      venda.getTotal()
    );
    return Venda.reconstituir(
      Number(resultado.lastInsertRowid),
      venda.getClienteId(),
      venda.getProdutoId(),
      venda.getQuantidade(),
      venda.getTotal()
    );
  }

  listar(): Venda[] {
    const stmt = db.prepare("SELECT * FROM vendas");
    const linhas = stmt.all() as VendaRow[];
    return linhas.map((linha) =>
      Venda.reconstituir(
        linha.id,
        linha.cliente_id,
        linha.produto_id,
        linha.quantidade,
        linha.total
      )
    );
  }
}
