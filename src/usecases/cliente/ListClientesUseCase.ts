import { Cliente } from "../../models/Cliente";
import { IClienteRepository } from "../../repositories/ClienteRepository";

export class ListClientesUseCase {
  constructor(private readonly repository: IClienteRepository) {}

  execute(): Cliente[] {
    return this.repository.listar();
  }
}
