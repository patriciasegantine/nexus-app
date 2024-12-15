'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats } from '@/hooks/dashboard/use-dashboard-stats'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Loader2 } from 'lucide-react'
import { TASK_PRIORITIES_COLORS } from "@/constants/task"

export function PriorityDistribution() {
  const {data, isLoading} = useDashboardStats()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </CardContent>
      </Card>
    )
  }
  
  const priority = Object.entries(data?.byPriority || {}).map(([name, value]) => ({
    name,
    value,
    color: TASK_PRIORITIES_COLORS[name as keyof typeof TASK_PRIORITIES_COLORS]
  }))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priority}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              stroke="white"
              strokeWidth={2}
            >
              {priority.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip
              content={({active, payload}) => {
                if (!active || !payload?.[0]) return null
                
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-8 rounded"
                        style={{backgroundColor: data.color}}
                      />
                      <span className="font-medium text-foreground">
                        {data.name.toLowerCase()} Priority
                      </span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {data.value} tasks
                    </div>
                  </div>
                )
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm font-medium text-foreground capitalize">
                  {value.toLowerCase()}
                </span>
              )}
              iconType="rect"
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
