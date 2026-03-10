import { Venda } from "../../models/Venda";
import { IVendaRepository } from "../../repositories/VendaRepository";

export class ListVendasUseCase {
  constructor(private readonly repository: IVendaRepository) {}

  execute(): Venda[] {
    return this.repository.listar();
  }
}
