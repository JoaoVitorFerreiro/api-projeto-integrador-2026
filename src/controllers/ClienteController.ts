import { app } from "../server";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { CreateClienteUseCase } from "../usecases/cliente/CreateClienteUseCase";
import { GetClienteByIdUseCase } from "../usecases/cliente/GetClienteByIdUseCase";
import { GetClienteByNomeUseCase } from "../usecases/cliente/GetClienteByNomeUseCase";
import { ListClientesUseCase } from "../usecases/cliente/ListClientesUseCase";

export function ClienteController() {
  const repository = new ClienteRepository();

  app.get("/clientes", (req, res) => {
    const { nome } = req.query;

    // Se veio ?nome=xxx na URL, faz busca por nome
    if (nome) {
      const cliente = new GetClienteByNomeUseCase(repository).execute(nome as string);
      if (cliente) {
        return res.json({ id: cliente.getId(), nome: cliente.getNome(), email: cliente.getEmail() });
      }
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    // Sem filtro: retorna todos
    const useCase = new ListClientesUseCase(repository);
    const clientes = useCase.execute();
    res.json(
      clientes.map((c) => ({
        id: c.getId(),
        nome: c.getNome(),
        email: c.getEmail(),
      }))
    );
  });

  // Busca por id: GET /clientes/1
  app.get("/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const cliente = new GetClienteByIdUseCase(repository).execute(id);
    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }
    res.json({ id: cliente.getId(), nome: cliente.getNome(), email: cliente.getEmail() });
  });

  app.post("/clientes", (req, res) => {
    try {
      const { nome, email } = req.body;
      const useCase = new CreateClienteUseCase(repository);
      const cliente = useCase.execute({ nome, email });
      res.status(201).json({
        id: cliente.getId(),
        nome: cliente.getNome(),
        email: cliente.getEmail(),
      });
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro interno";
      res.status(400).json({ erro: mensagem });
    }
  });
}
