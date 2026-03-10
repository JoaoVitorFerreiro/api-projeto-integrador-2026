import { Produto } from "../../models/Produto";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";

export class GetProdutoByNomeUseCase {
  constructor(private readonly repository: IProdutoRepository) {}

  execute(nome: string): Produto | null {
    return this.repository.buscarPorNome(nome);
  }
}
