import { Venda } from "../../models/Venda";
import { VendaItem } from "../../models/VendaItem";
import { IProdutoRepository } from "../../repositories/ProdutoRepository";
import { IVendaRepository } from "../../repositories/VendaRepository";

interface ItemInput {
  produtoId: number;
  quantidade: number;
}

interface Input {
  clienteId: number;
  itens: ItemInput[];
}

export class CreateVendaUseCase {
  constructor(
    private readonly vendaRepository: IVendaRepository,
    private readonly produtoRepository: IProdutoRepository
  ) {}

  execute(input: Input): Venda {
    if (!input.itens || input.itens.length === 0) {
      throw new Error("A venda deve ter ao menos um item");
    }

    const itens: VendaItem[] = [];
    const produtosAtualizados = [];

    for (const itemInput of input.itens) {
      const produto = this.produtoRepository.buscarPorId(itemInput.produtoId);
      if (!produto) {
        throw new Error(`Produto ${itemInput.produtoId} não encontrado`);
      }

      const produtoAtualizado = produto.reduzirEstoque(itemInput.quantidade);
      produtosAtualizados.push(produtoAtualizado);

      itens.push(VendaItem.create(0, produto.getId(), itemInput.quantidade, produto.getPreco()));
    }

    const venda = Venda.create(input.clienteId, itens);
    const vendaSalva = this.vendaRepository.salvar(venda);

    for (const produto of produtosAtualizados) {
      this.produtoRepository.atualizarEstoque(produto);
    }

    return vendaSalva;
  }
}
