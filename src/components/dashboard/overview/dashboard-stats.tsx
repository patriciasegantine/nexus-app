'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStats } from '@/hooks/dashboard/use-stats'
import { CheckCircle2, Clock, ListTodo, Loader2 } from 'lucide-react'
import React from "react";

interface StatsCardProps {
  title: string
  value: number | string | undefined
  icon?: React.ReactNode
  isLoading: boolean
}

export function DashboardStats() {
  const {data: stats, isLoading} = useStats()
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="Total Work Items"
        value={stats?.totalWorkItems}
        icon={<ListTodo className="h-4 w-4 text-muted-foreground"/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="In Progress"
        value={stats?.inProgress}
        icon={<Clock className="h-4 w-4 text-blue-500"/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="Completed"
        value={stats?.completed}
        icon={<CheckCircle2 className="h-4 w-4 text-green-500"/>}
        isLoading={isLoading}
      />
      <StatsCard
        title="Completion Rate"
        value={`${stats?.completionRate}%`}
        icon={<CheckCircle2 className="h-4 w-4 text-green-500"/>}
        isLoading={isLoading}
      />
    </div>
  )
}

function StatsCard({title, value, icon, isLoading}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin"/>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
