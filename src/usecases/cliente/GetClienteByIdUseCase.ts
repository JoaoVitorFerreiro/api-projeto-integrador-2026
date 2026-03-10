import { Cliente } from "../../models/Cliente";
import { IClienteRepository } from "../../repositories/ClienteRepository";

export class GetClienteByIdUseCase {
  constructor(private readonly repository: IClienteRepository) {}

  execute(id: number): Cliente | null {
    return this.repository.buscarPorId(id);
  }
}
