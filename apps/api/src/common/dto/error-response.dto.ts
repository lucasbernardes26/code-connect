import { ApiProperty } from '@nestjs/swagger';

/** Standard HTTP error payload returned by NestJS exceptions and validation pipes. */
export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Invalid email or password' },
      { type: 'array', items: { type: 'string' }, example: ['email must be an email'] },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
