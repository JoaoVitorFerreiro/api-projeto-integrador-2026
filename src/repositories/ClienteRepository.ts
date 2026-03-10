import db from "../database/database";
import { Cliente } from "../models/Cliente";

type ClienteRow = { id: number; nome: string; email: string };

export interface IClienteRepository {
  salvar(cliente: Cliente): Cliente;
  listar(): Cliente[];
  buscarPorId(id: number): Cliente | null;
  buscarPorNome(nome: string): Cliente | null;
}

export class ClienteRepository implements IClienteRepository {
  salvar(cliente: Cliente): Cliente {
    const query = db.prepare(
      "INSERT INTO clientes (nome, email) VALUES (?, ?)"
    );
    const resultado = query.run(cliente.getNome(), cliente.getEmail());
    return Cliente.reconstituir(
      Number(resultado.lastInsertRowid), // id gerado pelo banco
      cliente.getNome(),
      cliente.getEmail()
    );
  }

  listar(): Cliente[] {
    const stmt = db.prepare("SELECT * FROM clientes");
    const linhas = stmt.all() as ClienteRow[];
    return linhas.map((linha) =>
      Cliente.reconstituir(linha.id, linha.nome, linha.email)
    );
  }

  buscarPorId(id: number): Cliente | null {
    const stmt = db.prepare("SELECT * FROM clientes WHERE id = ?");
    const linha = stmt.get(id) as ClienteRow | undefined;
    if (!linha) return null;
    return Cliente.reconstituir(linha.id, linha.nome, linha.email);
  }

  buscarPorNome(nome: string): Cliente | null {
    const stmt = db.prepare("SELECT * FROM clientes WHERE nome LIKE ?");
    const linha = stmt.get(`%${nome}%`) as ClienteRow | undefined;
    if (!linha) return null;
    return Cliente.reconstituir(linha.id, linha.nome, linha.email);
  }
}
