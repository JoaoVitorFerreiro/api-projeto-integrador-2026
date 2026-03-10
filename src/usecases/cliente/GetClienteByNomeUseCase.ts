import { Cliente } from "../../models/Cliente";
import { IClienteRepository } from "../../repositories/ClienteRepository";

export class GetClienteByNomeUseCase {
  constructor(private readonly repository: IClienteRepository) {}

  execute(nome: string): Cliente | null {
    return this.repository.buscarPorNome(nome);
  }
}
