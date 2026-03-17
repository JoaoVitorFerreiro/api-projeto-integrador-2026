import { app } from "../server";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

export function ProdutoController() {
  const repository = new ProdutoRepository();

  app.get("/produtos", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const produto = repository.buscarPorNome(nome as string);
      if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
      return res.json(produto);
    }

    res.json(repository.listar());
  });

  app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produto = repository.buscarPorId(id);
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
  });

  app.post("/produtos", (req, res) => {
    try {
      const { nome, preco, estoque } = req.body;

      if (!nome || nome.trim().length === 0) throw new Error("Nome é obrigatório");
      if (preco <= 0) throw new Error("Preço deve ser maior que zero");
      if (estoque < 0) throw new Error("Estoque não pode ser negativo");

      const produto = repository.salvar({ nome, preco, estoque });
      res.status(201).json(produto);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
