import { getTaskPrioritySummary } from '@/lib/data/dashboard'
import { PriorityDistribution } from './priority-distribution'

export async function PriorityDistributionSection() {
  const { byPriority } = await getTaskPrioritySummary()

  return <PriorityDistribution byPriority={byPriority} />
}
