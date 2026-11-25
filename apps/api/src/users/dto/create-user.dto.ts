import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** Payload for registering a new user. */
export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
    minLength: 2,
    maxLength: 120,
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'ada@example.com',
    maxLength: 254,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo de 6 caracteres)',
    example: 'secret123',
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
