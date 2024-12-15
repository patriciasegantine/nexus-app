'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStats } from '@/hooks/dashboard/use-stats'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts'
import { Loader2 } from 'lucide-react'
import { TASK_STATUS_COLORS } from "@/constants/task";

export function WorkItemChart() {
  const {data: stats, isLoading} = useStats()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Work Items by Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </CardContent>
      </Card>
    )
  }
  
  const data = Object.entries(stats?.byStatus || {}).map(([name, value]) => ({
    name: name.replace('_', ' ').toLowerCase(),
    value,
    color: TASK_STATUS_COLORS[name as keyof typeof TASK_STATUS_COLORS]
  }))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Items by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted"/>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({active, payload}) => {
                  if (!active || !payload?.length) return null
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2"
                          style={{backgroundColor: payload[0].payload.color}}
                        />
                        <span className="font-medium">
                          {payload[0].payload.name}
                        </span>
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {payload[0].value} items
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
            {Object.entries(TASK_STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="h-3 w-8" style={{backgroundColor: color}}/>
                <span className="text-sm text-muted-foreground capitalize">
                  {status.toLowerCase().replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
