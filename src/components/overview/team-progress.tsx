'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { useTeamProgress } from "@/hooks/dashboard/use-dashboard-stats";

export function TeamProgress() {
  const {data: teamProgress, isLoading} = useTeamProgress()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamProgress?.map((member) => (
          <div key={member.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar}/>
                  <AvatarFallback>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{member.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {member.completedTasks}/{member.totalTasks}
              </span>
            </div>
            <Progress
              value={(member.completedTasks / member.totalTasks) * 100}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
