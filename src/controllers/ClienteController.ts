import { app } from "../server";
import { ClienteRepository } from "../repositories/ClienteRepository";

export function ClienteController() {
  const repository = new ClienteRepository();

  app.get("/clientes", (req, res) => {
    const { nome } = req.query;

    if (nome) {
      const cliente = repository.buscarPorNome(nome as string);
      if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
      return res.json(cliente);
    }

    res.json(repository.listar());
  });

  app.get("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const cliente = repository.buscarPorId(id);
    if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(cliente);
  });

  app.post("/clientes", (req, res) => {
    try {
      const { nome, email } = req.body;

      if (!nome || nome.trim().length === 0) throw new Error("Nome é obrigatório");
      if (!email || !email.includes("@")) throw new Error("Email inválido");

      const cliente = repository.salvar({ nome, email });
      res.status(201).json(cliente);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
