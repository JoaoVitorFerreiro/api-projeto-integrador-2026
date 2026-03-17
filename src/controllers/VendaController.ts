import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";
import { VendaRepository } from "../repositories/VendaRepository";
import { VendaItem } from "../models/VendaItem";

export function VendaController() {
  const vendaRepository = new VendaRepository();
  const produtoRepository = new ProdutoRepository();

  app.get("/vendas", (req, res) => {
    res.json(vendaRepository.listar());
  });

  app.post("/vendas", (req, res) => {
    try {
      const { clienteId, itens } = req.body;

      if (!itens || itens.length === 0) throw new Error("A venda deve ter ao menos um item");

      let total = 0;
      const itensDaVenda: VendaItem[] = [];
      const estoqueParaAtualizar: { id: number; novoEstoque: number }[] = [];

      for (const item of itens) {
        const produto = produtoRepository.buscarPorId(item.produtoId);
        if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);
        if (item.quantidade > produto.estoque) {
          throw new Error(`Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}`);
        }

        const subtotal = item.quantidade * produto.preco;
        total += subtotal;

        itensDaVenda.push({
          produtoId: produto.id!,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal,
        });

        estoqueParaAtualizar.push({ id: produto.id!, novoEstoque: produto.estoque - item.quantidade });
      }

      const venda = vendaRepository.salvar({ clienteId, total, itens: itensDaVenda });

      for (const p of estoqueParaAtualizar) {
        produtoRepository.atualizarEstoque(p.id, p.novoEstoque);
      }

      res.status(201).json(venda);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
