import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Authenticate, CurrentUser, Public } from '@nestjs/authentication';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import type { User } from '../users/entities/user.entity.js';
import { CommentResponseDto } from './dto/comment-response.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ListPostsQueryDto } from './dto/list-posts-query.dto.js';
import {
  PaginatedPostsResponseDto,
  PostDetailDto,
  PostLikeStatusDto,
} from './dto/post-response.dto.js';
import { PostsService } from './posts.service.js';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Authenticate({ optional: true })
  @ApiSecurity({})
  @ApiOperation({
    summary: 'Listar e pesquisar posts do feed',
    description:
      'Retorna posts paginados com Full-Text Search (q), filtro por tag e ordenação (recent ou popular).',
  })
  @ApiOkResponse({
    description: 'Feed de posts retornado com sucesso.',
    type: PaginatedPostsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de consulta inválidos.',
    type: ErrorResponseDto,
  })
  list(
    @Query() query: ListPostsQueryDto,
    @CurrentUser() user: User | null,
  ): Promise<PaginatedPostsResponseDto> {
    return this.postsService.list(query, user?.id);
  }

  @Get(':id')
  @Authenticate({ optional: true })
  @ApiSecurity({})
  @ApiOperation({
    summary: 'Obter detalhes de um post',
    description: 'Retorna os dados completos de um post pelo seu UUID.',
  })
  @ApiOkResponse({
    description: 'Detalhes do post encontrados.',
    type: PostDetailDto,
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
    type: ErrorResponseDto,
  })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User | null,
  ): Promise<PostDetailDto> {
    return this.postsService.findById(id, user?.id);
  }

  @Post(':id/likes')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Curtir um post',
    description: 'Registra uma curtida do usuário autenticado no post (idempotente).',
  })
  @ApiCreatedResponse({
    description: 'Curtida registrada com sucesso.',
    type: PostLikeStatusDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação obrigatória para curtir posts.',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
    type: ErrorResponseDto,
  })
  likePost(@Param('id') id: string, @CurrentUser() user: User): Promise<PostLikeStatusDto> {
    return this.postsService.likePost(id, user.id);
  }

  @Delete(':id/likes/me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover curtida de um post',
    description: 'Remove a curtida do usuário autenticado no post.',
  })
  @ApiOkResponse({
    description: 'Curtida removida com sucesso.',
    type: PostLikeStatusDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação obrigatória.',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
    type: ErrorResponseDto,
  })
  unlikePost(@Param('id') id: string, @CurrentUser() user: User): Promise<PostLikeStatusDto> {
    return this.postsService.unlikePost(id, user.id);
  }

  @Get(':id/comments')
  @Public()
  @ApiSecurity({})
  @ApiOperation({
    summary: 'Listar comentários de um post',
    description: 'Retorna todos os comentários de um post em ordem cronológica.',
  })
  @ApiOkResponse({
    description: 'Comentários retornados com sucesso.',
    type: [CommentResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
    type: ErrorResponseDto,
  })
  listComments(@Param('id') id: string): Promise<CommentResponseDto[]> {
    return this.postsService.listComments(id);
  }

  @Post(':id/comments')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Comentar em um post',
    description: 'Adiciona um comentário do usuário autenticado ao post.',
  })
  @ApiCreatedResponse({
    description: 'Comentário criado com sucesso.',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de comentário inválidos.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação obrigatória para comentar.',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
    type: ErrorResponseDto,
  })
  createComment(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.postsService.createComment(id, user.id, dto);
  }
}
