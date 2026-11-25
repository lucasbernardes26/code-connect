# Code Connect

Plataforma de comunidade para pessoas desenvolvedoras compartilharem projetos, trechos de código e aprendizados técnicos. Conta com feed de publicações, busca Full-Text, filtro por tags, ordenação por recentes ou populares, curtidas, comentários, autenticação JWT e perfil de usuário.

---

## Sumário

- [Tech Stack](#-tech-stack)
- [Arquitetura do Monorepo](#-arquitetura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Principais Rotas e Endpoints](#-principais-rotas-e-endpoints)
- [Comandos Disponíveis](#-comandos-disponíveis)
- [Qualidade e Testes](#-qualidade-e-testes)

---

## Tech Stack

### Frontend (`apps/web`)
- **React 19** + **TypeScript** (strict mode, ESM)
- **Vite 8** para build e servidor de desenvolvimento
- **Tailwind CSS v4** (`@tailwindcss/vite`) com tokens semânticos (`@theme`)
- **React Router 8** para roteamento e guards (`ProtectedRoute`, `PublicOnlyRoute`)
- **Axios** para comunicação HTTP com a API
- **Atomic Design** (`atoms`, `molecules`, `organisms`, `templates`, `pages`)
- **Vitest**, **React Testing Library** e **axe-core** para testes unitários e de acessibilidade
- **oxlint** para linting

### Backend (`apps/api`)
- **NestJS 12** + **TypeScript** (strict mode, ESM)
- **PostgreSQL 17** (via Docker Compose)
- **Drizzle ORM** + **drizzle-kit** para modelagem, migrações e queries SQL
- **@nestjs/authentication** para autenticação JWT Bearer e hash de senhas
- **@nestjs/swagger** para documentação interativa OpenAPI (`/docs`)
- **class-validator** & **class-transformer** para validação de DTOs
- **Vitest** & **Supertest** para testes unitários e end-to-end (E2E)
- **oxlint** (`--type-aware`) e **Prettier** para linting e formatação

### Monorepo & Infraestrutura
- **pnpm workspaces** (`apps/*`)
- **Docker Compose** com PostgreSQL 17 Alpine e volume persistente (`postgres_data`)

---

## Arquitetura do Monorepo

```text
code-connect/
├── apps/
│   ├── web/                    # Frontend React 19 + Vite + Tailwind CSS
│   │   ├── public/             # Assets estáticos (logos, avatares, capas)
│   │   └── src/
│   │       ├── components/     # Atomic Design (atoms, molecules, organisms, templates)
│   │       ├── contexts/       # Contexto de autenticação (AuthProvider)
│   │       ├── hooks/          # Hooks customizados (useAuth)
│   │       ├── pages/          # FeedPage, HomePage (Perfil), LoginPage, RegisterPage
│   │       ├── routes/         # Layouts e guards de rotas
│   │       └── services/       # Clientes HTTP (auth, posts) e contratos
│   └── api/                    # Backend NestJS 12 + Drizzle + PostgreSQL
│       ├── drizzle/            # Migrações SQL versionadas
│       ├── src/
│       │   ├── auth/           # Login e emissão de tokens JWT
│       │   ├── common/         # DTOs compartilhados (ex: ErrorResponseDto)
│       │   ├── database/       # Schema Drizzle e script de seed
│       │   ├── posts/          # Feed, busca, curtidas e comentários
│       │   └── users/          # Cadastro e perfil do usuário autenticado
│       └── test/               # Suíte de testes E2E
├── docker-compose.yml          # Container PostgreSQL 17
├── package.json                # Scripts centralizados na raiz
├── pnpm-workspace.yaml         # Configuração dos workspaces
└── AGENTS.md                   # Diretrizes de arquitetura e padrões do projeto
```

---

## Pré-requisitos

- **Node.js** (v22+ recomendado)
- **pnpm** (gerenciador de pacotes obrigatório do repositório)
- **Docker** e **Docker Compose** (para o banco PostgreSQL)

---

## Como Rodar Localmente

Execute todos os comandos a partir da **raiz do monorepo**:

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie os arquivos de exemplo de cada aplicação:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

> Em Windows PowerShell, use `Copy-Item apps/api/.env.example apps/api/.env` e `Copy-Item apps/web/.env.example apps/web/.env`.

### 3. Subir o banco de dados e aplicar migrações

```bash
docker compose up -d
pnpm run db:migrate
```

*(Opcional)* Popular o banco com autores, posts, curtidas e comentários iniciais:

```bash
pnpm run db:seed
```

### 4. Iniciar as aplicações em desenvolvimento

```bash
pnpm run dev
```

Isso iniciará simultaneamente:
- **Frontend (Web):** `http://localhost:5173`
- **Backend (API):** `http://localhost:3000`
- **Documentação Swagger:** `http://localhost:3000/docs`

---

## Variáveis de Ambiente

### Backend (`apps/api/.env`)

| Variável | Descrição | Padrão (`.env.example`) |
| --- | --- | --- |
| `PORT` | Porta HTTP da API NestJS | `3000` |
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://codeconnect:codeconnect@localhost:5432/codeconnect` |
| `JWT_SECRET` | Chave secreta para assinatura JWT (mín. 32 caracteres) | `change-this-secret-to-at-least-32-characters-long` |
| `JWT_TTL` | Tempo de expiração do token JWT | `15m` |
| `CORS_ORIGINS` | Origens permitidas no CORS (separadas por vírgula) | `http://localhost:5173` |

### Frontend (`apps/web/.env`)

| Variável | Descrição | Padrão (`.env.example`) |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API NestJS | `http://localhost:3000` |

---

## Principais Rotas e Endpoints

### Rotas do Frontend (`apps/web`)
- `/` — Feed público de publicações (busca, filtro por tags, ordenação e modal de comentários)
- `/login` — Autenticação de usuário (apenas visitantes)
- `/cadastro` — Criação de nova conta (apenas visitantes)
- `/perfil` — Área autenticada do usuário (protegida por `ProtectedRoute`)

### Endpoints da API (`apps/api`)
- `POST /auth/tokens` — Autentica usuário e retorna token JWT Bearer
- `POST /users` — Cadastra um novo usuário
- `GET /users/me` — Retorna dados do usuário autenticado
- `GET /posts` — Lista posts paginados com Full-Text Search (`q`), filtro por `tag` e ordenação (`recent` | `popular`)
- `GET /posts/:id` — Detalhes de um post
- `POST /posts/:id/likes` — Curte um post (autenticado)
- `DELETE /posts/:id/likes/me` — Remove curtida de um post (autenticado)
- `GET /posts/:id/comments` — Lista comentários de um post
- `POST /posts/:id/comments` — Adiciona comentário a um post (autenticado)

> A especificação completa dos payloads e códigos de resposta pode ser explorada e testada em `http://localhost:3000/docs`.

---

## Comandos Disponíveis

Todos os scripts abaixo podem ser executados diretamente da raiz:

### Workspace Geral
- `pnpm run dev` — Inicia Frontend e Backend em paralelo
- `pnpm run build` — Compila todos os apps do workspace
- `pnpm run lint` — Executa o `oxlint` em todos os apps

### Frontend (`apps/web`)
- `pnpm run dev:web` — Inicia o servidor Vite (`http://localhost:5173`)
- `pnpm run build:web` — Gera o build de produção (`tsc -b && vite build`)
- `pnpm run preview:web` — Visualiza o build de produção localmente
- `pnpm run lint:web` — Executa o linter no frontend
- `pnpm run test:web` — Executa todos os testes do frontend via Vitest
- `pnpm run test:web:a11y` — Executa apenas a suíte de acessibilidade (`axe-core`)

### Backend (`apps/api`) & Banco de Dados
- `pnpm run dev:api` — Inicia o NestJS em modo watch (`http://localhost:3000`)
- `pnpm run build:api` — Compila a API NestJS
- `pnpm run start:api` / `pnpm run start:api:prod` — Inicia a API (normal / produção)
- `pnpm run lint:api` — Executa o `oxlint --type-aware` na API
- `pnpm run test:api` — Executa os testes unitários da API via Vitest
- `pnpm run test:api:watch` — Executa os testes unitários em modo watch
- `pnpm run test:api:e2e` — Executa os testes end-to-end da API
- `pnpm run db:migrate` — Aplica as migrações SQL do Drizzle no PostgreSQL
- `pnpm run db:seed` — Popula o banco com dados iniciais
- `pnpm --filter api run db:studio` — Abre o Drizzle Studio para inspecionar o banco

---

## Qualidade e Testes

O projeto segue práticas rigorosas de qualidade e acessibilidade:
- **Cobertura de componentes (Web):** todos os componentes Atomic Design possuem testes unitários (`*.spec.tsx`) e as páginas/componentes contam com verificação automática de acessibilidade via **axe-core** (`*.a11y.spec.tsx`).
- **Cobertura de serviços e controllers (API):** testes unitários (`*.spec.ts`) e testes E2E (`test/app.e2e-spec.ts`) executados com **Vitest**.
- **Linting e Formatação:** `oxlint` em ambos os apps e `prettier` na API (`pnpm --filter api run format`).
