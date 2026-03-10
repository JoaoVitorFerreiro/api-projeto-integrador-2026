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
