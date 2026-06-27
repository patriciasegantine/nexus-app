'use client'

import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Pencil, ImagePlus, Trash2, ZoomIn, ZoomOut, X } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type Mode = 'view' | 'crop' | 'confirm-remove'

type AvatarUploadDialogProps = {
  open: boolean
  mode: Mode
  src: string | null | undefined
  name: string
  cropSrc: string | null
  crop: { x: number; y: number }
  zoom: number
  isPending: boolean
  onClose: () => void
  onEdit: () => void
  onUploadClick: () => void
  onCropChange: (crop: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  onCropComplete: (_: Area, pixels: Area) => void
  onCancelCrop: () => void
  onSave: () => void
  onRemoveRequest: () => void
  onRemoveCancel: () => void
  onRemoveConfirm: () => void
}

export function AvatarUploadDialog({
  open, mode, src, name, cropSrc, crop, zoom, isPending,
  onClose, onEdit, onUploadClick, onCropChange, onZoomChange,
  onCropComplete, onCancelCrop, onSave, onRemoveRequest, onRemoveCancel, onRemoveConfirm,
}: AvatarUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showClose={false} className="gap-0 p-0 overflow-hidden sm:max-w-[578px]">

        {!isPending && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-white/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}

        <div className="flex items-center p-5 border-b border-border/50">
          <DialogTitle className="text-base font-semibold">Profile photo</DialogTitle>
        </div>

        <div className={`relative flex h-[480px] w-full items-center justify-center ${mode === 'crop' ? 'bg-zinc-950' : 'avatar-photo-bg'}`}>
          {mode === 'crop' && cropSrc ? (
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
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

        <div className="p-5">
          {mode === 'view' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <ActionButton icon={<Pencil className="h-4 w-4" />} label="Edit" disabled={!src} onClick={onEdit} />
                <ActionButton icon={<ImagePlus className="h-4 w-4" />} label="Update" onClick={onUploadClick} />
              </div>
              <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Delete" disabled={!src} destructive onClick={onRemoveRequest} />
            </div>
          )}

          {mode === 'crop' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onZoomChange(Math.max(1, +(zoom - 0.25).toFixed(2)))}
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
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  aria-label="Zoom"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full
                    [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted
                    [&::-webkit-slider-thumb]:mt-[-3px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
                    [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted
                    [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
                />
                <button
                  type="button"
                  onClick={() => onZoomChange(Math.min(3, +(zoom + 0.25).toFixed(2)))}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onCancelCrop} disabled={isPending}>Cancel</Button>
                <Button className="flex-1" onClick={onSave} disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</Button>
              </div>
            </div>
          )}

          {mode === 'confirm-remove' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Your profile photo will be permanently removed.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onRemoveCancel}>Cancel</Button>
                <Button variant="destructive" className="flex-1" onClick={onRemoveConfirm}>Remove</Button>
              </div>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
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
        ${destructive ? 'text-destructive/80 hover:text-destructive' : 'text-foreground/60 hover:text-foreground'}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors
        ${destructive ? 'hover:bg-destructive/10' : 'hover:bg-muted'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
