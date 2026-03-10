import { Produto } from "../../models/Produto";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";

export class ListProdutosUseCase {
  constructor(private readonly repository: IProdutoRepository) {}

  execute(): Produto[] {
    return this.repository.listar();
  }
}
