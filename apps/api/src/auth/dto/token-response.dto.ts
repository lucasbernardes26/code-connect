import { ApiProperty } from '@nestjs/swagger';

/** JWT access token response returned on successful login. */
export class TokenResponseDto {
  @ApiProperty({
    description: 'Token JWT Bearer assinado com HS256',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3NjQwNDAwMDB9.signature',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Tempo de expiração do token em segundos',
    example: 900,
  })
  expiresIn: number;
}
