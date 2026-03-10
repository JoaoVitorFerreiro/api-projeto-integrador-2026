import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";
import { CreateProdutoUseCase } from "../usecases/produto/CreateProdutoUseCase";
import { GetProdutoByIdUseCase } from "../usecases/produto/GetProdutoByIdUseCase";
import { GetProdutoByNomeUseCase } from "../usecases/produto/GetProdutoByNomeUseCase";
import { ListProdutosUseCase } from "../usecases/produto/ListProdutosUseCase";

export function ProdutoController() {
  const repository = new ProdutoRepository();

  app.get("/produtos", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const produto = new GetProdutoByNomeUseCase(repository).execute(nome as string);
      if (produto) {
        return res.json({ id: produto.getId(), nome: produto.getNome(), preco: produto.getPreco(), estoque: produto.getEstoque() });
      }
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const useCase = new ListProdutosUseCase(repository);
    const produtos = useCase.execute();
    res.json(
      produtos.map((p) => ({
        id: p.getId(),
        nome: p.getNome(),
        preco: p.getPreco(),
        estoque: p.getEstoque(),
      }))
    );
  });

  app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produto = new GetProdutoByIdUseCase(repository).execute(id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    res.json({ id: produto.getId(), nome: produto.getNome(), preco: produto.getPreco(), estoque: produto.getEstoque() });
  });

  app.post("/produtos", (req, res) => {
    try {
      const { nome, preco, estoque } = req.body;
      const useCase = new CreateProdutoUseCase(repository);
      const produto = useCase.execute({ nome, preco, estoque });
      res.status(201).json({
        id: produto.getId(),
        nome: produto.getNome(),
        preco: produto.getPreco(),
        estoque: produto.getEstoque(),
      });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
