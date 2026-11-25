import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { AuthService } from './auth.service.js';
import { CreateTokenDto } from './dto/create-token.dto.js';
import { TokenResponseDto } from './dto/token-response.dto.js';

@ApiTags('auth')
@Public()
@ApiSecurity({})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Efetuar login e gerar token JWT',
    description: 'Valida e-mail e senha e retorna um token JWT Bearer para autenticação.',
  })
  @ApiOkResponse({
    description: 'Login efetuado com sucesso.',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'E-mail ou senha inválidos.',
    type: ErrorResponseDto,
  })
  createToken(@Body() dto: CreateTokenDto): Promise<TokenResponseDto> {
    return this.authService.createToken(dto);
  }
}
