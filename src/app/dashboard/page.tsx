'use client'

import { DashboardStats } from '@/components/dashboard/overview/dashboard-stats'
import { TeamProgress } from '@/components/dashboard/overview/team-progress'
import { RecentActivities } from '@/components/dashboard/overview/recent-activities'
import { WorkItemChart } from '@/components/dashboard/overview/work-item-chart'
import { PriorityDistribution } from '@/components/dashboard/overview/priority-distribution'
import { TeamVelocity } from "@/components/dashboard/overview/team-velocity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          A summary of your team&#39;s progress and activities
        </p>
      </div>
      
      <DashboardStats/>
      
      <div className="grid gap-6 md:grid-cols-2">
        <WorkItemChart/>
        <PriorityDistribution/>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TeamVelocity/>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TeamProgress/>
        <RecentActivities/>
      </div>
    </div>
  )
}
