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

// Adiciona coluna estoque em produtos caso o banco já exista sem ela
const colunasProdutos = db.pragma("table_info(produtos)") as { name: string }[];
if (!colunasProdutos.some((c) => c.name === "estoque")) {
  db.exec("ALTER TABLE produtos ADD COLUMN estoque INTEGER NOT NULL DEFAULT 0");
}

// Se vendas ainda tem o schema antigo (com produto_id), recria as tabelas
const colunasVendas = db.pragma("table_info(vendas)") as { name: string }[];
if (colunasVendas.some((c) => c.name === "produto_id")) {
  db.exec(`
    DROP TABLE IF EXISTS venda_itens;
    DROP TABLE IF EXISTS vendas;

    CREATE TABLE vendas (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      total      REAL    NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE TABLE venda_itens (
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
}

export default db;
