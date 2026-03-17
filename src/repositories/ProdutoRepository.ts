import db from "../database/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
  salvar(produto: Produto): Produto {
    const resultado = db
      .prepare("INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)")
      .run(produto.nome, produto.preco, produto.estoque);

    return { id: Number(resultado.lastInsertRowid), nome: produto.nome, preco: produto.preco, estoque: produto.estoque };
  }

  listar(): Produto[] {
    return db.prepare("SELECT * FROM produtos").all() as Produto[];
  }

  buscarPorId(id: number): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto) ?? null;
  }

  buscarPorNome(nome: string): Produto | null {
    return (db.prepare("SELECT * FROM produtos WHERE nome LIKE ?").get(`%${nome}%`) as Produto) ?? null;
  }

  atualizarEstoque(id: number, estoque: number): void {
    db.prepare("UPDATE produtos SET estoque = ? WHERE id = ?").run(estoque, id);
  }
}
