import { fireEvent, render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/projects/project-card/project-card'
import type { ProjectBoardItem } from '@/types/project'
import type { ReactNode } from 'react'

const refresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

jest.mock('@/actions/projects', () => ({
  deleteProject: jest.fn(),
}))

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children, modal }: { children: ReactNode; modal?: boolean }) => (
    <div data-testid="project-dropdown" data-modal={String(modal)}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => children,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div role="menu">{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick?: () => void
  }) => (
    <button type="button" role="menuitem" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}))

jest.mock('../project-dialog/project-dialog', () => ({
  ProjectDialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }) =>
    open ? (
      <div role="dialog" aria-label="Edit project">
        <button type="button" onClick={() => onOpenChange(false)}>
          Close project dialog
        </button>
      </div>
    ) : null,
}))

jest.mock('../project-tags/project-tags', () => ({
  ProjectTags: ({
    tags,
    onTagClick,
  }: {
    tags: string[]
    onTagClick?: (tag: string) => void
  }) => (
    <div>
      {tags.map((tag) => (
        <button key={tag} type="button" onClick={() => onTagClick?.(tag)}>
          #{tag}
        </button>
      ))}
    </div>
  ),
}))

const project: ProjectBoardItem = {
  id: 'project-1',
  name: 'Website Redesign',
  slug: 'website-redesign',
  description: 'Refresh the marketing site',
  color: '#3b82f6',
  tags: ['design', 'frontend'],
  status: 'ACTIVE',
  priority: null,
  startDate: null,
  targetDate: null,
  icon: null,
  createdAt: new Date(2026, 5, 1),
  updatedAt: new Date(2026, 5, 1),
  total: 5,
  todo: 2,
  inProgress: 1,
  done: 2,
  progress: 40,
  overdue: 1,
}

describe('ProjectCard', () => {
  beforeEach(() => {
    refresh.mockClear()
  })

  it('opens and closes the edit dialog from the project menu', async () => {
    render(<ProjectCard project={project} />)

    expect(screen.getByTestId('project-dropdown')).toHaveAttribute('data-modal', 'false')

    fireEvent.click(screen.getByRole('menuitem', { name: /edit/i }))

    expect(screen.getByRole('dialog', { name: 'Edit project' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close project dialog' }))

    expect(screen.queryByRole('dialog', { name: 'Edit project' })).not.toBeInTheDocument()
  })

  it('requires the project slug before enabling destructive delete', async () => {
    render(<ProjectCard project={project} />)

    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }))

    const deleteButton = screen.getByRole('button', { name: 'Delete project' })
    expect(deleteButton).toBeDisabled()

    fireEvent.change(screen.getByPlaceholderText(project.slug), {
      target: { value: project.slug },
    })

    expect(deleteButton).toBeEnabled()
  })

  it('passes tag clicks to the parent filter handler', () => {
    const onTagClick = jest.fn()

    render(<ProjectCard project={project} onTagClick={onTagClick} />)

    fireEvent.click(screen.getByRole('button', { name: '#frontend' }))

    expect(onTagClick).toHaveBeenCalledWith('frontend')
  })
})
