import { ApiProperty } from '@nestjs/swagger';
import { PostAuthorDto } from './post-response.dto.js';

/** Public comment representation returned by comment endpoints. */
export class CommentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440010' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  postId: string;

  @ApiProperty({ example: 'Achei muito bom seu código!' })
  body: string;

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty({ example: '2026-11-25T10:15:00.000Z' })
  createdAt: Date;
}
