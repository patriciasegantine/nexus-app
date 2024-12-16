'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVelocity } from '@/hooks/dashboard/use-dashboard-stats'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Loader2 } from 'lucide-react'
import { VELOCITY_STATUS, VELOCITY_STATUS_COLORS, VELOCITY_STATUS_NAMES } from "@/constants/velocity";

export function TeamVelocity() {
  const {data: velocity, isLoading} = useVelocity()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Velocity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Velocity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={velocity}>
            <XAxis dataKey="sprint"/>
            <YAxis/>
            <Tooltip/>
            <Legend
              formatter={(value: string) => (
                <span className="text-sm font-medium text-foreground capitalize">
                  {value}
                </span>
              )}
              iconType="rect"
              wrapperStyle={{paddingTop: '20px'}}
            />
            
            <Bar
              dataKey={VELOCITY_STATUS.PLANNED}
              fill={VELOCITY_STATUS_COLORS.PLANNED}
              name={VELOCITY_STATUS_NAMES.PLANNED}
            />
            <Bar
              dataKey={VELOCITY_STATUS.COMPLETED}
              fill={VELOCITY_STATUS_COLORS.COMPLETED}
              name={VELOCITY_STATUS_NAMES.COMPLETED}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
