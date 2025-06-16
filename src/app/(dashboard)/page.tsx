'use client'

import { DashboardStats } from '@/components/overview/dashboard-stats'
import { TeamProgress } from '@/components/overview/team-progress'
import { RecentActivities } from '@/components/overview/recent-activities'
import { WorkItemChart } from '@/components/overview/work-item-chart'
import { PriorityDistribution } from '@/components/overview/priority-distribution'
import { TeamVelocity } from "@/components/overview/team-velocity";
import { BurndownChart } from "@/components/overview/burndown-chart";

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
        <BurndownChart/>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TeamProgress/>
        <RecentActivities/>
      </div>
    </div>
  )
}
