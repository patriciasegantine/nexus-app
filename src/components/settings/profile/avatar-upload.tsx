'use client'

import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { AvatarCropModal } from '@/components/settings/profile/avatar-crop-modal'

type AvatarUploadProps = {
  src: string | null | undefined
  name: string
  onSave: (url: string) => void
}

export function AvatarUpload({ src, name, onSave }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageSrc(URL.createObjectURL(file))
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleClose() {
    if (imageSrc) URL.revokeObjectURL(imageSrc)
    setImageSrc(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-16 w-16 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change avatar"
      >
        <UserAvatar src={src} name={name} size="xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {imageSrc && (
        <AvatarCropModal
          open
          imageSrc={imageSrc}
          onClose={handleClose}
          onSave={onSave}
        />
      )}
    </>
  )
}
