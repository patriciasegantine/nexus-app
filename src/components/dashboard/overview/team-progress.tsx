'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStats } from '@/hooks/dashboard/use-stats'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

interface TeamMemberProgress {
  id: string
  name: string
  avatar?: string
  completedTasks: number
  totalTasks: number
}

export function TeamProgress() {
  const {isLoading} = useStats()
  
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
  
  const teamProgress: TeamMemberProgress[] = [
    {
      id: '1',
      name: 'John Doe',
      completedTasks: 5,
      totalTasks: 8,
    },
    {
      id: '2',
      name: 'Jane Smith',
      completedTasks: 8,
      totalTasks: 10,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      completedTasks: 11,
      totalTasks: 15,
    },
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamProgress.map((member) => (
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
