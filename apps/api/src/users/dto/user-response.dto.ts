import { ApiProperty } from '@nestjs/swagger';
import type { User } from '../entities/user.entity.js';

/** Public user representation returned by user endpoints. */
export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único (UUID v4) do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
  })
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'ada@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Data e hora de criação do registro em ISO 8601',
    example: '2026-11-25T03:00:00.000Z',
  })
  createdAt: Date;

  /** Maps a domain User object to a public UserResponseDto. */
  static fromUser(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
