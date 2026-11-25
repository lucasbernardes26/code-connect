import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, vi } from 'vitest'
import { Avatar } from '../components/atoms/Avatar'
import { BrandLogo } from '../components/atoms/BrandLogo'
import { Button } from '../components/atoms/Button'
import { DecorativeLogo } from '../components/atoms/DecorativeLogo'
import { Divider } from '../components/atoms/Divider'
import { Icon } from '../components/atoms/Icon'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Tag } from '../components/atoms/Tag'
import { TextLink } from '../components/atoms/TextLink'
import { AuthHeader } from '../components/molecules/AuthHeader'
import { AuthPrompt } from '../components/molecules/AuthPrompt'
import { Checkbox } from '../components/molecules/Checkbox'
import { FeedTabs } from '../components/molecules/FeedTabs'
import { FormField } from '../components/molecules/FormField'
import { NavItem } from '../components/molecules/NavItem'
import { PostActionStat } from '../components/molecules/PostActionStat'
import { PostCover } from '../components/molecules/PostCover'
import { SearchBar } from '../components/molecules/SearchBar'
import { SocialButton } from '../components/molecules/SocialButton'
import { LoginForm } from '../components/organisms/LoginForm'
import { PostCard } from '../components/organisms/PostCard'
import { RegisterForm } from '../components/organisms/RegisterForm'
import { SidebarNav } from '../components/organisms/SidebarNav'
import { SocialLogin } from '../components/organisms/SocialLogin'
import { AuthTemplate } from '../components/templates/AuthTemplate'
import { expectNoWcagViolations } from './a11y'

describe('Components (WCAG AA)', () => {
  describe('Atoms', () => {
    it('BrandLogo', async () => {
      const { container } = render(<BrandLogo />)
      await expectNoWcagViolations(container)
    })

    it('Button (primary, ghost, disabled)', async () => {
      const { container } = render(
        <div>
          <Button>Entrar</Button>
          <Button variant="ghost" icon={<Icon name="arrow-right" />}>
            Continuar
          </Button>
          <Button disabled>Indisponível</Button>
        </div>,
      )
      await expectNoWcagViolations(container)
    })

    it('DecorativeLogo', async () => {
      const { container } = render(<DecorativeLogo />)
      await expectNoWcagViolations(container)
    })

    it('Divider (plain and labeled)', async () => {
      const { container } = render(
        <div>
          <Divider />
          <Divider label="ou" />
        </div>,
      )
      await expectNoWcagViolations(container)
    })

    it('Input and Label', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="email-field">Email</Label>
          <Input id="email-field" type="email" placeholder="seu@email.com" />
        </div>,
      )
      await expectNoWcagViolations(container)
    })

    it('TextLink', async () => {
      const { container } = render(
        <MemoryRouter>
          <TextLink to="/login">Voltar para login</TextLink>
        </MemoryRouter>,
      )
      await expectNoWcagViolations(container)
    })
  })

  describe('Molecules', () => {
    it('AuthHeader', async () => {
      const { container } = render(<AuthHeader title="Login" subtitle="Boas-vindas!" />)
      await expectNoWcagViolations(container)
    })

    it('AuthPrompt', async () => {
      const { container } = render(
        <MemoryRouter>
          <AuthPrompt question="Ainda não tem conta?" linkLabel="Crie seu cadastro!" to="/cadastro" />
        </MemoryRouter>,
      )
      await expectNoWcagViolations(container)
    })

    it('Checkbox (unchecked and checked)', async () => {
      const { container } = render(
        <div>
          <Checkbox id="cb-1" label="Lembrar-me" checked={false} onChange={vi.fn()} />
          <Checkbox id="cb-2" label="Aceito os termos" checked onChange={vi.fn()} />
        </div>,
      )
      await expectNoWcagViolations(container)
    })

    it('FormField (default and error state)', async () => {
      const { container } = render(
        <div>
          <FormField id="ff-1" label="Nome" placeholder="Seu nome" />
          <FormField id="ff-2" label="Email" error="Informe um email válido" />
        </div>,
      )
      await expectNoWcagViolations(container)
    })

    it('SocialButton', async () => {
      const { container } = render(<SocialButton iconSrc="/github.svg" label="GitHub" />)
      await expectNoWcagViolations(container)
    })
  })

  describe('Organisms & Templates', () => {
    it('SocialLogin', async () => {
      const { container } = render(<SocialLogin label="ou entre com outras contas" />)
      await expectNoWcagViolations(container)
    })

    it('LoginForm', async () => {
      const { container } = render(
        <MemoryRouter>
          <LoginForm onSubmit={vi.fn()} />
        </MemoryRouter>,
      )
      await expectNoWcagViolations(container)
    })

    it('RegisterForm', async () => {
      const { container } = render(
        <MemoryRouter>
          <RegisterForm onSubmit={vi.fn()} />
        </MemoryRouter>,
      )
      await expectNoWcagViolations(container)
    })

    it('AuthTemplate', async () => {
      const { container } = render(
        <AuthTemplate bannerSrc="/banner.png" bannerAlt="Banner de autenticação" showBrandLogo>
          <h1>Autenticação</h1>
        </AuthTemplate>,
      )
      await expectNoWcagViolations(container)
    })

    it('Feed atoms, molecules, and organisms', async () => {
      const { container } = render(
        <MemoryRouter>
          <div>
            <Avatar src={null} name="Júlio Oliveira" />
            <Tag label="React" active removable onClick={vi.fn()} />
            <NavItem icon="feed" label="Feed" to="/" active />
            <FeedTabs activeTab="recent" onChange={vi.fn()} />
            <SearchBar
              value=""
              onChange={vi.fn()}
              tags={['React', 'Front-end']}
              selectedTag={null}
              onToggleTag={vi.fn()}
              onClearAll={vi.fn()}
            />
            <PostCover src={null} alt="Post de exemplo" />
            <PostActionStat icon="heart" count={4} label="Curtir" onClick={vi.fn()} />
            <SidebarNav isAuthenticated={false} onLogout={vi.fn()} currentPath="/" />
            <PostCard
              post={{
                id: 'p1',
                slug: 'post-1',
                title: 'Post de exemplo',
                summary: 'Resumo do post',
                coverImageUrl: null,
                tags: ['React'],
                likesCount: 4,
                commentsCount: 1,
                sharesCount: 2,
                likedByMe: false,
                createdAt: '2026-11-25T10:00:00.000Z',
                author: { id: 'u1', name: 'Júlio', handle: '@julio', avatarUrl: null },
              }}
              canInteract
              onToggleLike={vi.fn()}
              onOpenComments={vi.fn()}
            />
          </div>
        </MemoryRouter>,
      )
      await expectNoWcagViolations(container)
    })
  })
})
