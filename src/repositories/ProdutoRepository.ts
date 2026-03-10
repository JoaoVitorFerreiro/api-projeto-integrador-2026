import db from "../database/database";
import { Produto } from "../models/Produto";

type ProdutoRow = { id: number; nome: string; preco: number };

export interface IProdutoRepository {
  salvar(produto: Produto): Produto;
  listar(): Produto[];
  buscarPorId(id: number): Produto | null;
  buscarPorNome(nome: string): Produto | null;
}

export class ProdutoRepository implements IProdutoRepository {
  salvar(produto: Produto): Produto {
    const query = db.prepare(
      "INSERT INTO produtos (nome, preco) VALUES (?, ?)"
    );
    const resultado = query.run(produto.getNome(), produto.getPreco());
    return Produto.reconstituir(
      Number(resultado.lastInsertRowid), // id gerado pelo banco
      produto.getNome(),
      produto.getPreco()
    );
  }

  listar(): Produto[] {
    // .all() executa o SELECT e retorna todas as linhas como array
    const stmt = db.prepare("SELECT * FROM produtos");
    const linhas = stmt.all() as ProdutoRow[];
    return linhas.map((linha) =>
      Produto.reconstituir(linha.id, linha.nome, linha.preco)
    );
  }

  buscarPorId(id: number): Produto | null {
    // .get() executa o SELECT e retorna apenas uma linha (ou undefined)
    const stmt = db.prepare("SELECT * FROM produtos WHERE id = ?");
    const linha = stmt.get(id) as ProdutoRow | undefined;
    if (!linha) return null;
    return Produto.reconstituir(linha.id, linha.nome, linha.preco);
  }

  buscarPorNome(nome: string): Produto | null {
    // LIKE com % faz busca parcial: "note" encontra "Notebook", etc.
    const stmt = db.prepare("SELECT * FROM produtos WHERE nome LIKE ?");
    const linha = stmt.get(`%${nome}%`) as ProdutoRow | undefined;
    if (!linha) return null;
    return Produto.reconstituir(linha.id, linha.nome, linha.preco);
  }
}
