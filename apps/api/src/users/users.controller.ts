import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser, Public } from '@nestjs/authentication';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiSecurity({})
  @ApiOperation({
    summary: 'Cadastrar novo usuário',
    description:
      'Cria um novo usuário no PostgreSQL com nome, e-mail único e senha com hash seguro.',
  })
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos.',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'E-mail já cadastrado.',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return UserResponseDto.fromUser(user);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter dados do usuário logado',
    description: 'Retorna os dados públicos do usuário autenticado via token JWT Bearer.',
  })
  @ApiOkResponse({
    description: 'Dados do usuário autenticado.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  me(@CurrentUser() user: User): UserResponseDto {
    return UserResponseDto.fromUser(user);
  }
}
