import { PasswordHasher } from '@nestjs/authentication';
import { eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const DEFAULT_DATABASE_URL = 'postgresql://codeconnect:codeconnect@localhost:5432/codeconnect';

type SeedAuthor = {
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
};

type SeedPost = {
  slug: string;
  title: string;
  summary: string;
  codeSnippet: string;
  coverImageUrl: string | null;
  tags: string[];
  sharesCount: number;
  authorEmail: string;
  createdAtOffsetHours: number;
  likedByEmails: string[];
  comments: Array<{
    id: string;
    authorEmail: string;
    body: string;
    createdAtOffsetMinutes: number;
  }>;
};

const SEED_AUTHORS: SeedAuthor[] = [
  {
    name: 'Júlio Oliveira',
    email: 'julio@codeconnect.dev',
    username: 'julio',
    avatarUrl: '/avatars/julio.png',
  },
  {
    name: 'Márcia Santos',
    email: 'marcia@codeconnect.dev',
    username: 'marcia',
    avatarUrl: null,
  },
  {
    name: 'Gabriel Luz',
    email: 'gabriel@codeconnect.dev',
    username: 'gabriel_luz',
    avatarUrl: null,
  },
  {
    name: 'Marcela Lins',
    email: 'marcela@codeconnect.dev',
    username: 'marcela.lins',
    avatarUrl: null,
  },
  {
    name: 'Ana Costa',
    email: 'ana@codeconnect.dev',
    username: 'ana.dev',
    avatarUrl: null,
  },
];

const SEED_POSTS: SeedPost[] = [
  {
    slug: 'design-system-acessivel-com-react-e-tailwind',
    title: 'Design System acessível com React 19 e Tailwind',
    summary:
      'Construindo tokens semânticos, foco visível e componentes reutilizáveis com Atomic Design e validação automática via axe-core.',
    codeSnippet: `export function Button({ variant = 'primary', children, ...props }: ButtonProps) {\n  return (\n    <button className={cn(baseClasses, variants[variant])} {...props}>\n      {children}\n    </button>\n  );\n}`,
    coverImageUrl: '/posts/cover-1.png',
    tags: ['React', 'Front-end', 'Acessibilidade'],
    sharesCount: 14,
    authorEmail: 'julio@codeconnect.dev',
    createdAtOffsetHours: 1,
    likedByEmails: [
      'marcia@codeconnect.dev',
      'gabriel@codeconnect.dev',
      'marcela@codeconnect.dev',
      'ana@codeconnect.dev',
    ],
    comments: [
      {
        id: '10000000-0000-4000-8000-000000000001',
        authorEmail: 'marcia@codeconnect.dev',
        body: 'Achei muito bom seu código, @julio, parabéns!',
        createdAtOffsetMinutes: 45,
      },
      {
        id: '10000000-0000-4000-8000-000000000002',
        authorEmail: 'gabriel@codeconnect.dev',
        body: 'Quanto tempo você levou para finalizar esse projeto?',
        createdAtOffsetMinutes: 30,
      },
      {
        id: '10000000-0000-4000-8000-000000000003',
        authorEmail: 'julio@codeconnect.dev',
        body: 'Até que foi rápido, uns 3 dias organizando os tokens!',
        createdAtOffsetMinutes: 20,
      },
    ],
  },
  {
    slug: 'upload-de-imagens-e-preview-instantaneo',
    title: 'Upload de imagens com preview instantâneo no navegador',
    summary:
      'Como criar uma área de dropzone responsiva com validação de tamanho, leitura via FileReader e estados de progresso claros.',
    codeSnippet: `const handleDrop = (files: FileList) => {\n  const file = files[0];\n  if (!file || file.size > MAX_BYTES) return;\n  setPreviewUrl(URL.createObjectURL(file));\n};`,
    coverImageUrl: '/posts/cover-2.png',
    tags: ['Front-end', 'React', 'TypeScript'],
    sharesCount: 9,
    authorEmail: 'julio@codeconnect.dev',
    createdAtOffsetHours: 3,
    likedByEmails: ['marcia@codeconnect.dev', 'ana@codeconnect.dev'],
    comments: [
      {
        id: '10000000-0000-4000-8000-000000000004',
        authorEmail: 'marcela@codeconnect.dev',
        body: 'Lembrar de chamar URL.revokeObjectURL no cleanup do useEffect faz toda diferença.',
        createdAtOffsetMinutes: 90,
      },
    ],
  },
  {
    slug: 'microinteracoes-para-botoes-de-audio-e-player',
    title: 'Microinterações táteis para controles de áudio na web',
    summary:
      'Explorando estados ativos, aria-pressed e contraste adequado em botões circulares inspirados em hardware de estúdio.',
    codeSnippet: `<button\n  type="button"\n  aria-pressed={isPlaying}\n  aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}\n  onClick={toggle}\n/>`,
    coverImageUrl: '/posts/cover-3.png',
    tags: ['CSS', 'Acessibilidade', 'Front-end'],
    sharesCount: 6,
    authorEmail: 'marcia@codeconnect.dev',
    createdAtOffsetHours: 5,
    likedByEmails: ['julio@codeconnect.dev'],
    comments: [],
  },
  {
    slug: 'layout-mobile-first-para-agendamento',
    title: 'Layout mobile-first para fluxo de agendamento de serviços',
    summary:
      'Organizando seleção de datas, avaliações e cartões de serviço em telas estreitas sem perder legibilidade.',
    codeSnippet: `export function SlotPicker({ slots, selected, onSelect }: SlotPickerProps) {\n  return (\n    <div role="radiogroup" className="grid grid-cols-3 gap-2">\n      {slots.map((slot) => (\n        <SlotButton key={slot} active={slot === selected} onClick={() => onSelect(slot)} />\n      ))}\n    </div>\n  );\n}`,
    coverImageUrl: '/posts/cover-4.png',
    tags: ['React', 'CSS', 'Front-end'],
    sharesCount: 11,
    authorEmail: 'gabriel@codeconnect.dev',
    createdAtOffsetHours: 8,
    likedByEmails: [
      'julio@codeconnect.dev',
      'marcia@codeconnect.dev',
      'marcela@codeconnect.dev',
    ],
    comments: [
      {
        id: '10000000-0000-4000-8000-000000000005',
        authorEmail: 'ana@codeconnect.dev',
        body: 'Ficou muito limpo o espaçamento entre os horários!',
        createdAtOffsetMinutes: 120,
      },
    ],
  },
  {
    slug: 'sliders-customizados-com-suporte-a-teclado',
    title: 'Sliders customizados com suporte completo a teclado',
    summary:
      'Implementação de controle deslizante com gradientes suaves, atalhos de seta e anúncio de valores para leitores de tela.',
    codeSnippet: `function clamp(value: number, min: number, max: number) {\n  return Math.min(Math.max(value, min), max);\n}`,
    coverImageUrl: '/posts/cover-5.png',
    tags: ['Acessibilidade', 'TypeScript', 'Front-end'],
    sharesCount: 18,
    authorEmail: 'marcela@codeconnect.dev',
    createdAtOffsetHours: 12,
    likedByEmails: [
      'julio@codeconnect.dev',
      'marcia@codeconnect.dev',
      'gabriel@codeconnect.dev',
      'ana@codeconnect.dev',
    ],
    comments: [],
  },
  {
    slug: 'kit-de-componentes-para-dashboards-analiticos',
    title: 'Kit de componentes modulares para dashboards analíticos',
    summary:
      'Padronizando barras de progresso, seletores de período e filtros combinados com tipagem estrita em TypeScript.',
    codeSnippet: `type MetricFilter = {\n  range: '7d' | '30d' | '90d';\n  tags: string[];\n};`,
    coverImageUrl: '/posts/cover-6.png',
    tags: ['React', 'TypeScript', 'Front-end'],
    sharesCount: 7,
    authorEmail: 'ana@codeconnect.dev',
    createdAtOffsetHours: 18,
    likedByEmails: ['julio@codeconnect.dev', 'gabriel@codeconnect.dev'],
    comments: [],
  },
  {
    slug: 'full-text-search-no-postgresql-com-drizzle',
    title: 'Full-Text Search no PostgreSQL com Drizzle ORM e NestJS',
    summary:
      'Indexando título, resumo e trechos de código com tsvector ponderado e índice GIN para buscas rápidas em português.',
    codeSnippet: `const ftsVector = sql\`(\n  setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||\n  setweight(to_tsvector('portuguese', coalesce(summary, '')), 'B')\n)\`;`,
    coverImageUrl: null,
    tags: ['NestJS', 'TypeScript', 'PostgreSQL'],
    sharesCount: 22,
    authorEmail: 'julio@codeconnect.dev',
    createdAtOffsetHours: 24,
    likedByEmails: [
      'marcia@codeconnect.dev',
      'gabriel@codeconnect.dev',
      'marcela@codeconnect.dev',
      'ana@codeconnect.dev',
    ],
    comments: [
      {
        id: '10000000-0000-4000-8000-000000000006',
        authorEmail: 'gabriel@codeconnect.dev',
        body: 'Excelente uso de setweight para priorizar o título na relevância!',
        createdAtOffsetMinutes: 200,
      },
    ],
  },
  {
    slug: 'testes-de-acessibilidade-automatizados-com-vitest',
    title: 'Testes automatizados de acessibilidade WCAG AA com Vitest',
    summary:
      'Integrando axe-core nos testes de componentes React para detectar falhas de contraste e semântica antes do deploy.',
    codeSnippet: `export async function expectNoWcagViolations(container: HTMLElement) {\n  const results = await axe.run(container);\n  expect(results.violations).toEqual([]);\n}`,
    coverImageUrl: '/posts/thumb-inexistente.png',
    tags: ['Testes', 'Acessibilidade', 'React'],
    sharesCount: 15,
    authorEmail: 'ana@codeconnect.dev',
    createdAtOffsetHours: 30,
    likedByEmails: ['julio@codeconnect.dev', 'marcia@codeconnect.dev'],
    comments: [],
  },
];

async function runSeed() {
  const connectionString = process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });
  const hasher = new PasswordHasher();
  const defaultPasswordHash = await hasher.hash('secret123');

  try {
    const usersByEmail = new Map<string, string>();

    for (const author of SEED_AUTHORS) {
      const existing = await db
        .select()
        .from(schema.users)
        .where(
          or(
            eq(schema.users.email, author.email),
            eq(schema.users.username, author.username),
          ),
        )
        .limit(1);

      if (existing[0]) {
        await db
          .update(schema.users)
          .set({
            username: existing[0].username ?? author.username,
            avatarUrl: existing[0].avatarUrl ?? author.avatarUrl,
          })
          .where(eq(schema.users.id, existing[0].id));
        usersByEmail.set(author.email, existing[0].id);
      } else {
        const [created] = await db
          .insert(schema.users)
          .values({
            name: author.name,
            email: author.email,
            username: author.username,
            avatarUrl: author.avatarUrl,
            passwordHash: defaultPasswordHash,
          })
          .returning();
        if (created) {
          usersByEmail.set(author.email, created.id);
        }
      }
    }

    const now = Date.now();

    for (const post of SEED_POSTS) {
      const authorId = usersByEmail.get(post.authorEmail);
      if (!authorId) continue;

      const createdAt = new Date(now - post.createdAtOffsetHours * 3600 * 1000);

      const existingPost = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.slug, post.slug))
        .limit(1);

      let postId = existingPost[0]?.id;

      if (!postId) {
        const [inserted] = await db
          .insert(schema.posts)
          .values({
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            codeSnippet: post.codeSnippet,
            coverImageUrl: post.coverImageUrl,
            tags: post.tags,
            sharesCount: post.sharesCount,
            authorId,
            createdAt,
            updatedAt: createdAt,
          })
          .returning();
        postId = inserted?.id;
      }

      if (!postId) continue;

      for (const email of post.likedByEmails) {
        const userId = usersByEmail.get(email);
        if (!userId) continue;
        await db
          .insert(schema.postLikes)
          .values({ postId, userId })
          .onConflictDoNothing();
      }

      for (const comment of post.comments) {
        const commentAuthorId = usersByEmail.get(comment.authorEmail);
        if (!commentAuthorId) continue;
        await db
          .insert(schema.postComments)
          .values({
            id: comment.id,
            postId,
            authorId: commentAuthorId,
            body: comment.body,
            createdAt: new Date(now - comment.createdAtOffsetMinutes * 60 * 1000),
          })
          .onConflictDoNothing();
      }
    }

    console.info(`Seed completed: ${SEED_AUTHORS.length} authors, ${SEED_POSTS.length} posts.`);
  } finally {
    await pool.end();
  }
}

await runSeed();
