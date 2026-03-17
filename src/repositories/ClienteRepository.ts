import db from "../database/database";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  salvar(cliente: Cliente): Cliente {
    const resultado = db
      .prepare("INSERT INTO clientes (nome, email) VALUES (?, ?)")
      .run(cliente.nome, cliente.email);

    return { id: Number(resultado.lastInsertRowid), nome: cliente.nome, email: cliente.email };
  }

  listar(): Cliente[] {
    return db.prepare("SELECT * FROM clientes").all() as Cliente[];
  }

  buscarPorId(id: number): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as Cliente) ?? null;
  }

  buscarPorNome(nome: string): Cliente | null {
    return (db.prepare("SELECT * FROM clientes WHERE nome LIKE ?").get(`%${nome}%`) as Cliente) ?? null;
  }
}
