'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { useActivities } from '@/hooks/dashboard/use-activities'

export function RecentActivities() {
  const {data: activities, isLoading} = useActivities()
  
  if (isLoading) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar}/>
                <AvatarFallback>
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {activity.user.name}
                  </span>
                  {activity.action}
                  <span className="font-medium">
                    {activity.target}
                  </span>
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
