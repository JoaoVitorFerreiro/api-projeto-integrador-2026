# Projeto Integrador — API REST com Node.js + TypeScript

Este projeto é uma base para o desenvolvimento do Projeto Integrador. Ele implementa uma API REST utilizando **Node.js**, **TypeScript**, **Express** e **SQLite**, seguindo uma arquitetura em três camadas.

---

## Tecnologias utilizadas

| Tecnologia | Função |
|---|---|
| Node.js | Ambiente de execução JavaScript no servidor |
| TypeScript | Tipagem estática para JavaScript |
| Express | Framework para criação de rotas HTTP |
| Better-SQLite3 | Banco de dados local SQLite (sem instalação externa) |
| Nodemon | Reinicia o servidor automaticamente ao salvar arquivos |
| ts-node | Executa TypeScript diretamente sem compilar |

---

## Como iniciar o projeto do zero

### Passo 1: Criar a pasta do projeto

Crie uma pasta com o nome do seu projeto e abra-a no terminal.

---

### Passo 2: Inicializar o projeto Node.js

```bash
npm init -y
```

Este comando cria automaticamente o arquivo `package.json` com configurações padrão.

---

### Passo 3: Configurar o TypeScript

Crie o arquivo `tsconfig.json` na raiz do projeto:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "_version": "20.1.0",
  "compilerOptions": {
    "lib": ["es2023"],
    "module": "commonjs",
    "target": "es2022",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Passo 4: Configurar o package.json

Abra o `package.json` e substitua a seção `scripts` e adicione as dependências:

```json
{
  "name": "api",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/express": "^5.0.6",
    "@types/node": "^25.4.0",
    "nodemon": "^3.1.14",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "better-sqlite3": "^12.6.2",
    "express": "^5.2.1"
  }
}
```

---

### Passo 5: Instalar as dependências

```bash
npm install
```

---

### Passo 6: Criar a estrutura de pastas

Crie os diretórios dentro de `src/`:

```
src/
├── controllers/      → Recebe as requisições HTTP, aplica as regras de negócio e devolve as respostas
├── models/           → Define as entidades do domínio (ex: Cliente, Produto)
├── repositories/     → Faz a comunicação com o banco de dados
└── database/         → Configuração e inicialização do banco SQLite
```

No terminal:

```bash
mkdir -p src/controllers src/models src/repositories src/database
```

---

### Passo 7: Rodar o projeto

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

---

## Arquitetura do projeto

Este projeto segue uma **arquitetura em três camadas**. Cada camada tem uma responsabilidade clara e não deve misturar responsabilidades com outra.

```
Requisição HTTP
      ↓
  Controller       → Recebe req, aplica as regras de negócio, devolve res
      ↓
  Repository       → Acessa o banco de dados (o "como persistir")
      ↓
   Banco SQLite
```

### Por que separar em camadas?

- **Controller** conhece HTTP (`req`/`res`), mas não escreve SQL diretamente
- **Repository** não sabe nada de HTTP nem de regras de negócio — só persiste dados
- Cada parte pode ser alterada ou testada de forma independente

---

## Entidades do projeto base

### Cliente
| Campo | Tipo | Regra |
|---|---|---|
| id | number | Gerado pelo banco |
| nome | string | Obrigatório |
| email | string | Deve conter `@` |

### Produto
| Campo | Tipo | Regra |
|---|---|---|
| id | number | Gerado pelo banco |
| nome | string | Obrigatório |
| preco | number | Deve ser maior que zero |
| estoque | number | Não pode ser negativo |

### Venda
| Campo | Tipo | Regra |
|---|---|---|
| id | number | Gerado pelo banco |
| clienteId | number | Cliente deve existir |
| itens | VendaItem[] | Pelo menos um item |
| total | number | Calculado automaticamente |

### VendaItem
| Campo | Tipo | Descrição |
|---|---|---|
| produtoId | number | Produto deve existir |
| quantidade | number | Deve ser maior que zero |
| precoUnitario | number | Copiado do produto no momento da venda |
| subtotal | number | `quantidade × precoUnitario` |

---

## Rotas disponíveis

### Clientes

| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Lista todos os clientes |
| GET | `/clientes/:id` | Busca cliente por ID |
| GET | `/clientes?nome=xx` | Busca cliente por nome (parcial) |
| POST | `/clientes` | Cria um novo cliente |

```json
// POST /clientes
{
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

---

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| GET | `/produtos?nome=xx` | Busca produto por nome (parcial) |
| POST | `/produtos` | Cria um novo produto |

```json
// POST /produtos
{
  "nome": "Notebook",
  "preco": 3500,
  "estoque": 10
}
```

---

### Vendas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/vendas` | Lista todas as vendas com seus itens |
| POST | `/vendas` | Cria uma nova venda |

```json
// POST /vendas — aceita múltiplos produtos
{
  "clienteId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 3, "quantidade": 1 }
  ]
}
```

> O estoque de cada produto é validado e reduzido automaticamente ao criar a venda.

---

## Conceitos importantes

### Models como interfaces

Os modelos são definidos como `interface` TypeScript — estruturas simples que descrevem o formato dos dados sem comportamento próprio. As validações e regras de negócio ficam no Controller.

```typescript
export interface Cliente {
  id?: number;
  nome: string;
  email: string;
}
```

### Transação no banco

A criação de uma venda salva múltiplos registros (venda + itens). Isso é feito dentro de uma **transação** — se qualquer operação falhar, nenhuma alteração é salva no banco.

---

## Banco de dados

O banco SQLite é criado automaticamente no arquivo `banco.db` na raiz do projeto ao iniciar o servidor pela primeira vez. Não é necessário instalar nenhum software adicional.

### Estrutura das tabelas

```sql
clientes    (id, nome, email)
produtos    (id, nome, preco, estoque)
vendas      (id, cliente_id, total)
venda_itens (id, venda_id, produto_id, quantidade, preco_unitario, subtotal)
```
