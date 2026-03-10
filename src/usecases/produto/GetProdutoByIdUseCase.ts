import { Produto } from "../../models/Produto";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";

export class GetProdutoByIdUseCase {
  constructor(private readonly repository: IProdutoRepository) {}

  execute(id: number): Produto | null {
    return this.repository.buscarPorId(id);
  }
}
