import db from "../database/database";
import { Produto } from "../models/Produto";

type ProdutoRow = { id: number; nome: string; preco: number; estoque: number };

export interface IProdutoRepository {
  salvar(produto: Produto): Produto;
  listar(): Produto[];
  buscarPorId(id: number): Produto | null;
  buscarPorNome(nome: string): Produto | null;
  atualizarEstoque(produto: Produto): void;
}

export class ProdutoRepository implements IProdutoRepository {
  salvar(produto: Produto): Produto {
    const query = db.prepare(
      "INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)"
    );
    const resultado = query.run(produto.getNome(), produto.getPreco(), produto.getEstoque());
    return Produto.reconstituir(
      Number(resultado.lastInsertRowid),
      produto.getNome(),
      produto.getPreco(),
      produto.getEstoque()
    );
  }

  listar(): Produto[] {
    const query = db.prepare("SELECT * FROM produtos");
    const linhas = query.all() as ProdutoRow[];
    return linhas.map((linha) =>
      Produto.reconstituir(linha.id, linha.nome, linha.preco, linha.estoque)
    );
  }

  buscarPorId(id: number): Produto | null {
    const query = db.prepare("SELECT * FROM produtos WHERE id = ?");
    const linha = query.get(id) as ProdutoRow | undefined;
    if (!linha) return null;
    return Produto.reconstituir(linha.id, linha.nome, linha.preco, linha.estoque);
  }

  buscarPorNome(nome: string): Produto | null {
    const query = db.prepare("SELECT * FROM produtos WHERE nome LIKE ?");
    const linha = query.get(`%${nome}%`) as ProdutoRow | undefined;
    if (!linha) return null;
    return Produto.reconstituir(linha.id, linha.nome, linha.preco, linha.estoque);
  }

  atualizarEstoque(produto: Produto): void {
    const query = db.prepare("UPDATE produtos SET estoque = ? WHERE id = ?");
    query.run(produto.getEstoque(), produto.getId());
  }
}
