import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'
import { postsService } from './posts.service'

describe('postsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('lists posts with cleaned query params', async () => {
    const mockResponse = {
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    }
    const getSpy = vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResponse })

    const result = await postsService.listPosts({
      q: '  react  ',
      tag: 'Front-end',
      sort: 'popular',
      page: 2,
      limit: 6,
    })

    expect(getSpy).toHaveBeenCalledWith('/posts', {
      params: {
        q: 'react',
        tag: 'Front-end',
        sort: 'popular',
        page: 2,
        limit: 6,
      },
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls like, unlike, listComments, and createComment endpoints', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { likesCount: 1, likedByMe: true } })
    const deleteSpy = vi
      .spyOn(api, 'delete')
      .mockResolvedValue({ data: { likesCount: 0, likedByMe: false } })
    const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: [] })

    await postsService.likePost('post-1')
    expect(postSpy).toHaveBeenCalledWith('/posts/post-1/likes')

    await postsService.unlikePost('post-1')
    expect(deleteSpy).toHaveBeenCalledWith('/posts/post-1/likes/me')

    await postsService.listComments('post-1')
    expect(getSpy).toHaveBeenCalledWith('/posts/post-1/comments')

    await postsService.createComment('post-1', { body: 'Muito bom!' })
    expect(postSpy).toHaveBeenCalledWith('/posts/post-1/comments', { body: 'Muito bom!' })
  })
})
