import { Venda } from "../../models/Venda";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";
import { IVendaRepository } from "../../repositories/VendaRepository";

interface Input {
  clienteId: number;
  produtoId: number;
  quantidade: number;
}

export class CreateVendaUseCase {
  constructor(
    private readonly vendaRepository: IVendaRepository,
    private readonly produtoRepository: IProdutoRepository
  ) {}

  execute(input: Input): Venda {
    const produto = this.produtoRepository.buscarPorId(input.produtoId);
    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    const venda = Venda.create(
      input.clienteId,
      input.produtoId,
      input.quantidade,
      produto.getPreco()
    );

    return this.vendaRepository.salvar(venda);
  }
}
