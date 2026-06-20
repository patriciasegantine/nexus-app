'use client'

import { useState, useCallback, useTransition } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { ZoomIn, ZoomOut } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCroppedBlob } from '@/lib/crop-image'

type AvatarCropModalProps = {
  open: boolean
  imageSrc: string
  onClose: () => void
  onSave: (url: string) => void
}

export function AvatarCropModal({ open, imageSrc, onClose, onSave }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  function handleSave() {
    alert('Saving avatar...')
    setError('')
  }

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showClose={!isPending} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust your photo</DialogTitle>
        </DialogHeader>

        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-zinc-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-1">
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
            className="w-full cursor-pointer appearance-none bg-transparent
              [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border
              [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-[13px] [&::-webkit-slider-thumb]:w-[13px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
              [&::-moz-range-track]:h-[3px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-border
              [&::-moz-range-thumb]:h-[13px] [&::-moz-range-thumb]:w-[13px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground
              [&::-moz-range-progress]:bg-transparent"
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
