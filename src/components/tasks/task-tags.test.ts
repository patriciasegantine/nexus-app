import { getVisibleTagCount } from '@/components/tasks/task-tags'

jest.mock('@/actions/tasks', () => ({
  addTaskTag: jest.fn(),
}))

describe('getVisibleTagCount', () => {
  it('shows every tag when they fit on one line', () => {
    expect(getVisibleTagCount([40, 50, 60], 158)).toBe(3)
  })

  it('reserves space for the overflow counter', () => {
    expect(getVisibleTagCount([60, 60, 60], 130)).toBe(1)
  })

  it('shows only the overflow counter when no tag fits', () => {
    expect(getVisibleTagCount([100, 100], 80)).toBe(0)
  })
})
