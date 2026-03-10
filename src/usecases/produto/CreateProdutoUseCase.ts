import { Produto } from "../../models/Produto";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";

interface Input {
  nome: string;
  preco: number;
  estoque: number;
}

export class CreateProdutoUseCase {
  constructor(private readonly repository: IProdutoRepository) {}

  execute(input: Input): Produto {
    const produto = Produto.create(input.nome, input.preco, input.estoque);
    return this.repository.salvar(produto);
  }
}
