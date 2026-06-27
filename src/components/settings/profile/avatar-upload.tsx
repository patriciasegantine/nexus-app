'use client'

import { useRef, useState, useCallback, useTransition } from 'react'
import type { Area } from 'react-easy-crop'
import { Camera } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { AvatarUploadDialog } from '@/components/settings/profile/avatar-upload-dialog'
import { getCroppedBlob } from '@/lib/crop-image'
import { updateAvatar } from '@/actions/settings'
import { toast } from '@/hooks/use-toast'
import type { Mode } from '@/components/settings/profile/avatar-upload-dialog'

type AvatarUploadProps = {
  src: string | null | undefined
  name: string
  onSave: (url: string) => void
  onRemove?: () => void
}

export function AvatarUpload({ src, name, onSave, onRemove }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('view')
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [isNewFile, setIsNewFile] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isPending, startTransition] = useTransition()

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  function handleOpen() {
    setMode('view')
    setCropSrc(null)
    setIsNewFile(false)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setOpen(true)
  }

  function handleClose() {
    if (isPending) return
    if (isNewFile && cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setIsNewFile(false)
    setMode('view')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setOpen(false)
  }

  function handleEdit() {
    if (!src) return
    setCropSrc(src)
    setIsNewFile(false)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setMode('crop')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (isNewFile && cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(URL.createObjectURL(file))
    setIsNewFile(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setMode('crop')
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleCancelCrop() {
    if (isNewFile && cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setIsNewFile(false)
    setMode('view')
  }

  function handleSave() {
    if (!croppedAreaPixels || !cropSrc) return
    startTransition(async () => {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels)
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.set('avatar', file)

      const result = await updateAvatar(formData)
      if (!result.success) {
        toast({ variant: 'destructive', description: result.error ?? 'Upload failed' })
        return
      }

      onSave(result.url!)
      handleClose()
    })
  }

  function handleRemoveConfirm() {
    onRemove?.()
    handleClose()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="group relative h-16 w-16 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Edit avatar"
      >
        <UserAvatar src={src} name={name} size="xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      <AvatarUploadDialog
        open={open}
        mode={mode}
        src={src}
        name={name}
        cropSrc={cropSrc}
        crop={crop}
        zoom={zoom}
        isPending={isPending}
        onClose={handleClose}
        onEdit={handleEdit}
        onUploadClick={() => inputRef.current?.click()}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onCancelCrop={handleCancelCrop}
        onSave={handleSave}
        onRemoveRequest={() => setMode('confirm-remove')}
        onRemoveCancel={() => setMode('view')}
        onRemoveConfirm={handleRemoveConfirm}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
