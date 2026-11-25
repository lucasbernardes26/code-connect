# Code Connect - Monorepo

Este workspace foi configurado utilizando **pnpm workspaces**.

## Estrutura do Projeto

```text
code-connect/
├── apps/
│   ├── web/               # Aplicação React com Vite & TypeScript
│   └── api/               # Aplicação NestJS & TypeScript
├── package.json           # Scripts de atalho e configurações da raiz
├── pnpm-workspace.yaml    # Configuração dos pacotes do monorepo
└── README.md
```

## Comandos Rápidos na Raiz

Você pode executar os comandos abaixo diretamente da raiz sem precisar navegar para as pastas internas:

### Aplicação Web (React + Vite)
- `pnpm run dev:web`: Inicia o servidor de desenvolvimento do React/Vite.
- `pnpm run build:web`: Realiza o build de produção do frontend.
- `pnpm run lint:web`: Executa o linter no frontend.
- `pnpm run preview:web`: Visualiza o build de produção do frontend localmente.

### Banco de Dados (PostgreSQL + Docker)
- `docker compose up -d`: Sobe o banco PostgreSQL 17 em container com volume persistente (`postgres_data`).
- `pnpm --filter api run db:migrate`: Aplica as migrações SQL do Drizzle no PostgreSQL.

### Aplicação API (NestJS)
- `pnpm run dev:api`: Inicia o NestJS em modo watch (`start:dev`).
- `pnpm run build:api`: Realiza o build da API NestJS.
- `pnpm run start:api`: Inicia a aplicação NestJS normalmente.
- `pnpm run start:api:prod`: Executa o build compilado da API em produção.
- `pnpm run lint:api`: Executa o linter na API.
- `pnpm run test:api`: Executa os testes unitários da API via Vitest.
- `pnpm run test:api:watch`: Executa os testes unitários em modo watch.
- `pnpm run test:api:e2e`: Executa os testes end-to-end da API.

### Workspace Geral
- `pnpm run dev`: Executa ambos os servidores de desenvolvimento em paralelo.
- `pnpm run build`: Executa o build de todos os projetos recursivamente.
- `pnpm run lint`: Executa a verificação de lint em todos os projetos.
