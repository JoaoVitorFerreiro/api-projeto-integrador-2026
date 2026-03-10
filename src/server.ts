import express from "express";

import { ClienteController } from "./controllers/ClienteController";
import { ProdutoController } from "./controllers/ProdutoController";
import { VendaController } from "./controllers/VendaController";

export const app = express();

app.use(express.json());

ClienteController();
ProdutoController();
VendaController();

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
