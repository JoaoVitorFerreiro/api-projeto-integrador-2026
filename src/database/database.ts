import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../banco.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT    NOT NULL,
    email TEXT    NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nome    TEXT    NOT NULL,
    preco   REAL    NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS vendas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    total      REAL    NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  );

  CREATE TABLE IF NOT EXISTS venda_itens (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id       INTEGER NOT NULL,
    produto_id     INTEGER NOT NULL,
    quantidade     INTEGER NOT NULL,
    preco_unitario REAL    NOT NULL,
    subtotal       REAL    NOT NULL,
    FOREIGN KEY (venda_id)   REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
`);

export default db;
