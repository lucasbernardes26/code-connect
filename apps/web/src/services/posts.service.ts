import { api } from './api'
import type {
  CreateCommentRequest,
  ListPostsParams,
  PaginatedPostsResponse,
  PostComment,
  PostDetail,
  PostLikeStatus,
} from './contracts'

/** API client for posts feed, search, likes, and comments. */
export const postsService = {
  async listPosts(params: ListPostsParams = {}): Promise<PaginatedPostsResponse> {
    const queryParams: Record<string, string | number> = {}
    if (params.q?.trim()) {
      queryParams.q = params.q.trim()
    }
    if (params.tag?.trim()) {
      queryParams.tag = params.tag.trim()
    }
    if (params.sort) {
      queryParams.sort = params.sort
    }
    if (params.page) {
      queryParams.page = params.page
    }
    if (params.limit) {
      queryParams.limit = params.limit
    }

    const { data } = await api.get<PaginatedPostsResponse>('/posts', {
      params: queryParams,
    })
    return data
  },

  async getPostById(postId: string): Promise<PostDetail> {
    const { data } = await api.get<PostDetail>(`/posts/${postId}`)
    return data
  },

  async likePost(postId: string): Promise<PostLikeStatus> {
    const { data } = await api.post<PostLikeStatus>(`/posts/${postId}/likes`)
    return data
  },

  async unlikePost(postId: string): Promise<PostLikeStatus> {
    const { data } = await api.delete<PostLikeStatus>(`/posts/${postId}/likes/me`)
    return data
  },

  async listComments(postId: string): Promise<PostComment[]> {
    const { data } = await api.get<PostComment[]>(`/posts/${postId}/comments`)
    return data
  },

  async createComment(postId: string, payload: CreateCommentRequest): Promise<PostComment> {
    const { data } = await api.post<PostComment>(`/posts/${postId}/comments`, payload)
    return data
  },
}
