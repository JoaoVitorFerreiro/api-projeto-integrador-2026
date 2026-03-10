import { Cliente } from "../../models/Cliente";
import { IClienteRepository } from "../../repositories/ClienteRepository";

interface Input {
  nome: string;
  email: string;
}

export class CreateClienteUseCase {
  constructor(private readonly repository: IClienteRepository) {}

  execute(input: Input): Cliente {
    const cliente = Cliente.create(input.nome, input.email);
    return this.repository.salvar(cliente);
  }
}
