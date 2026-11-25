import { ApiProperty } from '@nestjs/swagger';

/** Public author summary attached to posts and comments. */
export class PostAuthorDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Júlio Oliveira' })
  name: string;

  @ApiProperty({ example: '@julio' })
  handle: string;

  @ApiProperty({ nullable: true, example: '/avatars/julio.png' })
  avatarUrl: string | null;
}

/** Feed card summary representation of a post. */
export class PostSummaryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'design-system-acessivel-com-react-e-tailwind' })
  slug: string;

  @ApiProperty({ example: 'Design System acessível com React 19 e Tailwind' })
  title: string;

  @ApiProperty({
    example: 'Construindo tokens semânticos e componentes reutilizáveis com Atomic Design.',
  })
  summary: string;

  @ApiProperty({ nullable: true, example: '/posts/cover-1.png' })
  coverImageUrl: string | null;

  @ApiProperty({ type: [String], example: ['React', 'Front-end', 'Acessibilidade'] })
  tags: string[];

  @ApiProperty({ example: 12 })
  likesCount: number;

  @ApiProperty({ example: 3 })
  commentsCount: number;

  @ApiProperty({ example: 14 })
  sharesCount: number;

  @ApiProperty({ example: false })
  likedByMe: boolean;

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty({ example: '2026-11-25T10:00:00.000Z' })
  createdAt: Date;
}

/** Detailed post representation including the code snippet. */
export class PostDetailDto extends PostSummaryDto {
  @ApiProperty({ example: 'export function Button() { return null; }' })
  codeSnippet: string;
}

/** Pagination metadata for feed responses. */
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 8 })
  total: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

/** Paginated list of posts returned by GET /posts. */
export class PaginatedPostsResponseDto {
  @ApiProperty({ type: [PostSummaryDto] })
  items: PostSummaryDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

/** Updated like state returned by POST/DELETE like endpoints. */
export class PostLikeStatusDto {
  @ApiProperty({ example: 13 })
  likesCount: number;

  @ApiProperty({ example: true })
  likedByMe: boolean;
}
