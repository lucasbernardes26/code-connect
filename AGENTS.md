# Diretrizes do Projeto (AGENTS.md)

Este documento define as regras fundamentais de arquitetura, padrões de código, gerenciamento de pacotes e diretrizes de desenvolvimento para este monorepo. Qualquer agente de IA ou desenvolvedor atuando neste repositório deve seguir rigorosamente as regras abaixo.

---

## 1. Visão Geral da Arquitetura

O projeto é um **monorepo** gerenciado com **pnpm workspaces** (`pnpm-workspace.yaml`).

```text
code-connect/
├── apps/
│   ├── web/               # Frontend React 19 + Vite (TypeScript, ESM)
│   └── api/               # Backend NestJS 12 (TypeScript, ESM, Vitest)
├── package.json           # Scripts globais e atalhos de workspace
├── pnpm-workspace.yaml    # Definição dos pacotes do monorepo ('apps/*')
├── .gitignore             # Ignora dependências, builds e caches
├── README.md              # Documentação de uso
└── AGENTS.md              # Regras fundamentais para agentes e devs
```

---

## 2. Gerenciamento de Pacotes e Execução de Comandos

- **Gerenciador Obrigatório**: Use **exclusivamente o `pnpm`**. Nunca use `npm` ou `yarn`.
- **Comandos a partir da Raiz**:
  - Sempre execute comandos a partir da raiz do monorepo utilizando os atalhos do `package.json` ou filtros do pnpm (`pnpm --filter <app> <comando>`).
  - **Evite** mudar de diretório (`cd apps/...`) para tarefas de rotina (build, dev, test, lint).
- **Atalhos Padronizados no Root**:
  - `pnpm run dev`: Inicia ambos os apps simultaneamente em paralelo.
  - `pnpm run dev:web`: Inicia o Vite (porta padrão `5173`).
  - `pnpm run dev:api`: Inicia o NestJS em modo watch (porta padrão `3000`).
  - `pnpm run build:web` / `pnpm run build:api`: Compila individualmente os apps.
  - `pnpm run build`: Compila recursivamente todos os apps do workspace.
  - `pnpm run lint`: Executa linter em todos os apps.
  - `pnpm run test:api`: Executa a suíte de testes unitários do NestJS via Vitest.
  - `pnpm run test:api:e2e`: Executa os testes end-to-end do NestJS.
- **Adicionando Novas Dependências**:
  - Na raiz (ferramentas globais): `pnpm add -D <pacote> -w`
  - No frontend: `pnpm --filter web add <pacote>`
  - No backend: `pnpm --filter api add <pacote>`

---

## 3. Diretrizes do Frontend (`apps/web`)

### 3.1. Arquitetura de Componentes: Atomic Design
A organização de componentes da interface deve seguir rigorosamente a metodologia **Atomic Design**:
```text
apps/web/src/
├── components/
│   ├── atoms/          # Elementos básicos indivisíveis (Button, Input, Icon, Typography)
│   ├── molecules/      # Agrupamentos de átomos com função simples (SearchField, FormField)
│   ├── organisms/      # Seções completas e complexas da UI (Header, UserCard, ProductList)
│   └── templates/      # Estruturas de layout da tela sem acoplamento a dados reais
└── pages/              # Instâncias das telas conectando templates com dados reais e rotas
```
- **Atoms**: Devem ser puramente visuais, desacoplados e altamente reutilizáveis.
- **Molecules**: Devem combinar poucos átomos para formar uma unidade funcional simples.
- **Organisms**: Devem orquestrar moléculas e átomos, contendo comportamentos de seção ou regras de apresentação mais ricas.
- **Templates**: Devem definir layouts de página e distribuição de slots/espaços.
- **Pages**: Devem conectar estado, chamadas de serviço/API e hooks aos templates.

### 3.2. Estilização: Tailwind CSS
- Utilize **Tailwind CSS** para toda e qualquer estilização de componentes.
- Evite estilos inline (`style={{ ... }}`) ou folhas de estilo CSS avulsas desnecessárias.
- **Paleta de Cores (`@theme`)**: Toda cor utilizada nos componentes deve referenciar os tokens semânticos definidos no `@theme` em `apps/web/src/index.css` (`ink`, `surface`, `primary`, `field`, `offwhite`, `muted`, `deco`, `danger`). É proibido usar hexadecimais diretos (`bg-[#...]`, `text-[#...]`) ou cores padrão fora da paleta (como `red-400`, `white`) nas classes dos componentes; se precisar de uma nova cor, estenda o `@theme` em `index.css`.
- **Tamanhos e Escalas**: Utilize sempre os tokens padrão da escala do Tailwind mais próximos para tipografia, espaçamento, dimensões e raios de borda (ex.: `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-3xl`, `rounded-4xl`, `max-w-5xl`), evitando valores arbitrários entre colchetes (`text-[15px]`, `rounded-[32px]`, `px-[78px]`).
- Componentes com variações visuais devem utilizar utilitários organizados (como classes condicionais ou `clsx` / `tailwind-merge` quando aplicável).

### 3.3. Cobertura de Testes para Componentes
- **Obrigatoriedade**: **Todo componente deve possuir um teste cobrindo seu uso essencial.**
- O arquivo de teste deve ser criado junto ao componente (ex: `Button.tsx` acompanhado de `Button.spec.tsx` ou dentro de uma pasta `__tests__/`).
- **O que testar no uso essencial**:
  1. Renderização correta do componente e conteúdo textual/ícones.
  2. Disparo correto de eventos ao interagir (ex: cliques em botões, digitação em inputs).
  3. Estados visuais ou comportamentais críticos (ex: desabilitado, carregando, estado de erro).
  4. Variações essenciais de props (ex: variants primária/secundária).

---

## 4. Diretrizes do Backend (`apps/api`)

### 4.1. Princípios REST Rigorosos
A API NestJS deve ser construída seguindo integralmente as melhores práticas arquiteturais **REST**:
- **Nomes de Recursos**:
  - Recursos representam substantivos no plural (ex: `/users`, `/products`, `/orders`).
  - Nunca utilize verbos na URI (evite rotas como `/getUsers`, `/createUser`, `/deleteItem`).
  - Para sub-recursos e relacionamentos hierárquicos, utilize: `/users/:id/orders` ou `/orders/:id/items`.
- **Semântica dos Métodos HTTP**:
  - `GET`: Leitura segura e idempotente de recursos. Nunca altere estado em operações `GET`.
  - `POST`: Criação de recursos subordinados ou ações não idempotentes. Retorne `201 Created` e preferencialmente o recurso criado.
  - `PUT`: Substituição/atualização integral e idempotente do recurso.
  - `PATCH`: Atualização parcial de campos específicos de um recurso.
  - `DELETE`: Exclusão idempotente do recurso. Retorne `204 No Content` (sem corpo) ou `200 OK`.
- **Status Codes HTTP Padronizados**:
  - `200 OK`: Sucesso geral (leitura, atualização síncrona).
  - `201 Created`: Criação de recurso bem-sucedida.
  - `204 No Content`: Sucesso sem conteúdo no corpo (ex: exclusão bem-sucedida).
  - `400 Bad Request`: Erro de sintaxe ou falha de validação de DTOs.
  - `401 Unauthorized`: Ausência de autenticação válida.
  - `403 Forbidden`: Autenticado, mas sem permissão de acesso ao recurso.
  - `404 Not Found`: Recurso não localizado.
  - `409 Conflict`: Conflito de estado ou duplicidade (ex: email já cadastrado).
  - `422 Unprocessable Entity`: Validação semântica ou regra de negócio violada.
  - `500 Internal Server Error`: Erro inesperado no servidor.
- **Stateless & Idempotência**:
  - O backend não deve armazenar estado de sessão do cliente. Todas as requisições devem ser autocontidas (tokens JWT / headers de autenticação).
- **Filtros, Ordenação e Paginação**:
  - Parâmetros de consulta para coleções devem ser passados via query parameters padronizados (ex: `/products?page=1&limit=20&sort=name:asc&category=electronics`).
- **Validação de Entrada com DTOs**:
  - Todo endpoint de mutação (`POST`, `PUT`, `PATCH`) deve validar rigorosamente os dados de entrada através de DTOs tipados com validação automática (`ValidationPipe` ou `StandardSchemaValidationPipe`).

### 4.2. Testes no Backend
- Mantenha testes unitários para cada Controller e Service (`*.spec.ts`).
- Execute `pnpm run test:api` antes de submeter alterações.

---

## 5. Padrões de Código e Tecnologias Compartilhadas

### 5.1. TypeScript & Módulos ESM
- Ambos os projetos utilizam **TypeScript em modo estrito (`strict: true`)** e módulos **ESM nativos (`"type": "module"`)**.
- No backend NestJS:
  - Importações relativas utilizam extensão explícita `.js` (conforme exigido pelo Node ESM).
  - Em vez de `__dirname`, utilize `import.meta.dirname`.

### 5.2. Qualidade de Código (Linting & Formatação)
- **Linter**: `oxlint` é utilizado para linting de alta performance tanto no frontend quanto no backend.
- **Formatador**: `prettier` no backend (`pnpm --filter api run format`).
- Garanta que qualquer alteração passe sem erros em `pnpm run lint`.

---

## 6. Controle de Versão e Git (Conventional Commits)

### 6.1. Padrão de Mensagens de Commit (Conventional Commits)
Todas as mensagens de commit devem seguir a convenção de **Conventional Commits**:

```text
<tipo>(<escopo opcional>): <descrição no imperativo e em letras minúsculas>

[corpo opcional explicando o motivo da mudança]

[rodapé opcional para referenciar issues ou breaking changes]
```

#### Tipos Permitidos:
- `feat`: Adição de nova funcionalidade (ex: `feat(web): add button atomic component`).
- `fix`: Correção de bug (ex: `fix(api): handle missing user in authentication`).
- `docs`: Modificações apenas na documentação (ex: `docs: update AGENTS.md with REST guidelines`).
- `style`: Alterações estéticas que não afetam a lógica (espaços em branco, formatação).
- `refactor`: Mudanças no código que não corrigem bug nem adicionam funcionalidade.
- `perf`: Mudanças no código voltadas para melhoria de desempenho.
- `test`: Adição de testes ausentes ou ajuste de testes existentes.
- `chore`: Modificações em scripts de build, dependências ou configurações de ferramentas (ex: `chore(web): configure tailwind css`).

#### Escopos Recomendados:
- `web`: Modificações restritas ao frontend React.
- `api`: Modificações restritas ao backend NestJS.
- `workspace` ou `root`: Alterações nos scripts e configurações do monorepo.

#### Breaking Changes:
- Mudanças que quebram compatibilidade devem ser sinalizadas com `!` antes dos dois pontos (ex: `feat(api)!: change user response schema`) ou com `BREAKING CHANGE:` no rodapé do commit.

### 6.2. Regras do Repositório Git
- **Repositório Unificado**: O Git opera **apenas na raiz**. É estritamente proibido inicializar repositórios Git internos em `apps/web`, `apps/api` ou subdiretórios.
- **Arquivos Ignorados**:
  - Nunca comite `node_modules/`, `dist/`, `.env*` (exceto `.env.example`), `.pnpm-store/`, arquivos de log ou arquivos de cache de build (`*.tsbuildinfo`).
  - Cada app possui seu respectivo `.gitignore` para regras locais, além do `.gitignore` principal na raiz.

---

## 7. Diretrizes Específicas para Agentes de IA

1. **Validação Contínua**: Sempre teste o build (`pnpm run build`) e execute a suíte de testes (`pnpm run test:api`) após fazer alterações significativas.
2. **Sem Quebra de Atalhos**: Nunca remova ou altere os nomes dos scripts existentes na raiz (`package.json`) sem solicitação explícita do usuário.
3. **Escopo Limpo**: Modifique apenas os arquivos necessários para atender à demanda atual, mantendo as configurações compartilhadas intactas.
4. **Respeito aos Commits Convencionais**: Ao sugerir ou gerar commits, use exclusivamente o padrão Conventional Commits com o escopo adequado.
