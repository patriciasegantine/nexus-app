'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBurndown } from '@/hooks/dashboard/use-dashboard-stats'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Loader2 } from 'lucide-react'
import { BURNDOWN_STATUS, BURNDOWN_STATUS_COLORS, BURNDOWN_STATUS_NAMES } from "@/constants/burndown";

export function BurndownChart() {
  const {data: burndown, isLoading} = useBurndown()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Burndown</CardTitle>
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
        <CardTitle>Burndown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={burndown}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
            <Legend
              formatter={(value: string) => (
                <span className="text-sm font-medium text-foreground capitalize">
                  {value}
                </span>
              )}
              wrapperStyle={{paddingTop: '20px'}}
            />
            <Line
              type="monotone"
              dataKey={BURNDOWN_STATUS.REMAIN}
              stroke={BURNDOWN_STATUS_COLORS.REMAIN}
              name={BURNDOWN_STATUS_NAMES.REMAIN}
            />
            <Line
              type="monotone"
              strokeDasharray="5 5"
              dataKey={BURNDOWN_STATUS.IDEAL}
              stroke={BURNDOWN_STATUS_COLORS.IDEAL}
              name={BURNDOWN_STATUS_NAMES.IDEAL}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
