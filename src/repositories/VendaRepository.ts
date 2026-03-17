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

export class VendaRepository {
  salvar(venda: Venda): Venda {
    const insertVenda = db.prepare("INSERT INTO vendas (cliente_id, total) VALUES (?, ?)");
    const insertItem = db.prepare(
      "INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)"
    );

    const executar = db.transaction(() => {
      const resultado = insertVenda.run(venda.clienteId, venda.total);
      const vendaId = Number(resultado.lastInsertRowid);

      const itensSalvos: VendaItem[] = venda.itens.map((item) => {
        const res = insertItem.run(vendaId, item.produtoId, item.quantidade, item.precoUnitario, item.subtotal);
        return {
          id: Number(res.lastInsertRowid),
          vendaId,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        };
      });

      return { id: vendaId, clienteId: venda.clienteId, total: venda.total, itens: itensSalvos };
    });

    return executar();
  }

  listar(): Venda[] {
    const vendas = db.prepare("SELECT * FROM vendas").all() as VendaRow[];
    const buscarItens = db.prepare("SELECT * FROM venda_itens WHERE venda_id = ?");

    return vendas.map((v) => {
      const itensRows = buscarItens.all(v.id) as VendaItemRow[];
      const itens: VendaItem[] = itensRows.map((i) => ({
        id: i.id,
        vendaId: i.venda_id,
        produtoId: i.produto_id,
        quantidade: i.quantidade,
        precoUnitario: i.preco_unitario,
        subtotal: i.subtotal,
      }));
      return { id: v.id, clienteId: v.cliente_id, total: v.total, itens };
    });
  }
}
