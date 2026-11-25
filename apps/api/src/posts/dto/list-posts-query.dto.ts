import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export type PostSortOption = 'recent' | 'popular';

/** Query parameters for listing and searching posts in the feed. */
export class ListPostsQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de busca Full-Text Search (título, resumo, código ou tags)',
    example: 'acessibilidade',
    maxLength: 120,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(120)
  q?: string;

  @ApiPropertyOptional({
    description: 'Filtro por tag específica (case-insensitive)',
    example: 'React',
    maxLength: 50,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(50)
  tag?: string;

  @ApiPropertyOptional({
    description: 'Ordenação do feed',
    enum: ['recent', 'popular'],
    default: 'recent',
  })
  @IsOptional()
  @IsIn(['recent', 'popular'])
  sort: PostSortOption = 'recent';

  @ApiPropertyOptional({
    description: 'Número da página (começando em 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 12,
    default: 12,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 12;
}
