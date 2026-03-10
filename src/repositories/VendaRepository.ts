import db from "../database/database";
import { Venda } from "../models/Venda";
import { VendaItem } from "../models/VendaItem";

type VendaRow = { id: number; cliente_id: number; total: number };
type VendaItemRow = {
  id: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
};

export interface IVendaRepository {
  salvar(venda: Venda): Venda;
  listar(): Venda[];
}

export class VendaRepository implements IVendaRepository {
  salvar(venda: Venda): Venda {
    const insertVenda = db.prepare(
      "INSERT INTO vendas (cliente_id, total) VALUES (?, ?)"
    );
    const insertItem = db.prepare(
      "INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)"
    );

    const executar = db.transaction(() => {
      const resultado = insertVenda.run(venda.getClienteId(), venda.getTotal());
      const vendaId = Number(resultado.lastInsertRowid);

      const itensSalvos: VendaItem[] = venda.getItens().map((item) => {
        const res = insertItem.run(
          vendaId,
          item.getProdutoId(),
          item.getQuantidade(),
          item.getPrecoUnitario(),
          item.getSubtotal()
        );
        return VendaItem.reconstituir(
          Number(res.lastInsertRowid),
          vendaId,
          item.getProdutoId(),
          item.getQuantidade(),
          item.getPrecoUnitario(),
          item.getSubtotal()
        );
      });

      return Venda.reconstituir(vendaId, venda.getClienteId(), itensSalvos, venda.getTotal());
    });

    return executar();
  }

  listar(): Venda[] {
    const vendas = db.prepare("SELECT * FROM vendas").all() as VendaRow[];
    const buscarItens = db.prepare("SELECT * FROM venda_itens WHERE venda_id = ?");

    return vendas.map((v) => {
      const itensRows = buscarItens.all(v.id) as VendaItemRow[];
      const itens = itensRows.map((i) =>
        VendaItem.reconstituir(i.id, i.venda_id, i.produto_id, i.quantidade, i.preco_unitario, i.subtotal)
      );
      return Venda.reconstituir(v.id, v.cliente_id, itens, v.total);
    });
  }
}
