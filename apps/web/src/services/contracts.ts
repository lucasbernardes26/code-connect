export type CreateTokenRequest = {
  email: string
  password: string
}

export type TokenResponse = {
  accessToken: string
  expiresIn: number
}

export type CreateUserRequest = {
  name: string
  email: string
  password: string
}

export type UserResponse = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type ApiErrorResponse = {
  statusCode: number
  message: string | string[]
  error: string
}

export type PostSortOption = 'recent' | 'popular'

export type PostAuthor = {
  id: string
  name: string
  handle: string
  avatarUrl: string | null
}

export type PostSummary = {
  id: string
  slug: string
  title: string
  summary: string
  coverImageUrl: string | null
  tags: string[]
  likesCount: number
  commentsCount: number
  sharesCount: number
  likedByMe: boolean
  author: PostAuthor
  createdAt: string
}

export type PostDetail = PostSummary & {
  codeSnippet: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedPostsResponse = {
  items: PostSummary[]
  meta: PaginationMeta
}

export type PostLikeStatus = {
  likesCount: number
  likedByMe: boolean
}

export type PostComment = {
  id: string
  postId: string
  body: string
  author: PostAuthor
  createdAt: string
}

export type ListPostsParams = {
  q?: string
  tag?: string
  sort?: PostSortOption
  page?: number
  limit?: number
}

export type CreateCommentRequest = {
  body: string
}
