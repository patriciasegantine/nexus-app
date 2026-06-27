'use client'

import { useRef, useState, useCallback, useTransition } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Camera, Pencil, ImagePlus, Trash2, ZoomIn, ZoomOut, X } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCroppedBlob } from '@/lib/crop-image'
import { updateAvatar } from '@/actions/settings'
import { toast } from '@/hooks/use-toast'

type AvatarUploadProps = {
  src: string | null | undefined
  name: string
  onSave: (url: string) => void
  onRemove?: () => void
}

type Mode = 'view' | 'crop' | 'confirm-remove'

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

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent showClose={false} className="gap-0 p-0 overflow-hidden sm:max-w-[578px]">

          {/* Close button — absolute, above everything */}
          {!isPending && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-white/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}

          {/* Header */}
          <div className="flex items-center p-5 border-b border-border/50">
            <DialogTitle className="text-base font-semibold">Profile photo</DialogTitle>
          </div>

          {/* Photo area */}
          <div
            className={`relative flex h-[480px] w-full items-center justify-center ${mode === 'crop' ? 'bg-zinc-950' : 'avatar-photo-bg'}`}
          >
            {mode === 'crop' && cropSrc ? (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <UserAvatar
                src={mode === 'confirm-remove' ? undefined : src}
                name={name}
                size="xl"
                className={`h-52 w-52 text-6xl transition-opacity ${mode === 'confirm-remove' ? 'opacity-20' : ''}`}
              />
            )}
          </div>

          {/* Controls */}
          <div className="p-5">

            {mode === 'view' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <ActionButton
                    icon={<Pencil className="h-4 w-4" />}
                    label="Edit"
                    disabled={!src}
                    onClick={handleEdit}
                  />
                  <ActionButton
                    icon={<ImagePlus className="h-4 w-4" />}
                    label="Update"
                    onClick={() => inputRef.current?.click()}
                  />
                </div>
                <ActionButton
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete"
                  disabled={!src}
                  destructive
                  onClick={() => setMode('confirm-remove')}
                />
              </div>
            )}

            {mode === 'crop' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    aria-label="Zoom"
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full
                      [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted
                      [&::-webkit-slider-thumb]:mt-[-3px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
                      [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted
                      [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleCancelCrop} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSave} disabled={isPending}>
                    {isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            )}

            {mode === 'confirm-remove' && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Your profile photo will be permanently removed.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setMode('view')}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleRemoveConfirm}>
                    Remove
                  </Button>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>

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

type ActionButtonProps = {
  icon: React.ReactNode
  label: string
  disabled?: boolean
  destructive?: boolean
  onClick: () => void
}

function ActionButton({ icon, label, disabled, destructive, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30
        ${destructive
          ? 'text-destructive/80 hover:text-destructive'
          : 'text-foreground/60 hover:text-foreground'
        }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors
        ${destructive ? 'hover:bg-destructive/10' : 'hover:bg-muted'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
