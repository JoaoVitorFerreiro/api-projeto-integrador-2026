import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(__dirname, "../../banco.db");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, Buffer.alloc(0), { mode: 0o666 });
} else {
  fs.chmodSync(dbPath, 0o666);
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT    NOT NULL,
    email TEXT    NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT    NOT NULL,
    preco REAL    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS vendas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id  INTEGER NOT NULL,
    produto_id  INTEGER NOT NULL,
    quantidade  INTEGER NOT NULL,
    total       REAL    NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
`);

export default db;
