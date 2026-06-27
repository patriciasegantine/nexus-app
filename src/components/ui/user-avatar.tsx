'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

type UserAvatarProps = {
  src?: string | null
  name: string
  size?: AvatarSize
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-16 w-16 text-xl',
}

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
}

export function UserAvatar({ src, name, size = 'md', className }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initial = name.trim()[0]?.toUpperCase() ?? 'U'
  const px = SIZE_PX[size]
  const showImage = src && !imgError

  return (
    <div className={cn('rounded-full shrink-0 overflow-hidden ring-2 ring-black/40 dark:ring-white/40', SIZE_CLASSES[size], className)}>
      {showImage ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-[hsl(var(--avatar-bg))]">
          <span className="text-white font-medium leading-none select-none">{initial}</span>
        </div>
      )}
    </div>
  )
}
