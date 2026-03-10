import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";
import { VendaRepository } from "../repositories/VendaRepository";
import { CreateVendaUseCase } from "../usecases/venda/CreateVendaUseCase";
import { ListVendasUseCase } from "../usecases/venda/ListVendasUseCase";

export function VendaController() {
  const vendaRepository = new VendaRepository();
  const produtoRepository = new ProdutoRepository();

  app.get("/vendas", (req, res) => {
    const useCase = new ListVendasUseCase(vendaRepository);
    const vendas = useCase.execute();
    res.json(
      vendas.map((v) => ({
        id: v.getId(),
        clienteId: v.getClienteId(),
        produtoId: v.getProdutoId(),
        quantidade: v.getQuantidade(),
        total: v.getTotal(),
      }))
    );
  });

  app.post("/vendas", (req, res) => {
    try {
      const { clienteId, produtoId, quantidade } = req.body;
      const useCase = new CreateVendaUseCase(vendaRepository, produtoRepository);
      const venda = useCase.execute({ clienteId, produtoId, quantidade });
      res.status(201).json({
        id: venda.getId(),
        clienteId: venda.getClienteId(),
        produtoId: venda.getProdutoId(),
        quantidade: venda.getQuantidade(),
        total: venda.getTotal(),
      });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
