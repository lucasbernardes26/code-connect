import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

/** Payload for creating a new comment on a post. */
export class CreateCommentDto {
  @ApiProperty({
    description: 'Texto do comentário',
    example: 'Excelente organização dos componentes!',
    minLength: 1,
    maxLength: 1000,
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  body: string;
}
