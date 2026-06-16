'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react"
import { Loader2, Plus } from "lucide-react"
import { addTaskTag, removeTaskTag } from "@/actions/tasks"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { toast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TAG_GAP = 4
const OVERFLOW_TRIGGER_WIDTH = 32

interface TaskTagsProps {
  taskId: string
  tags: string[]
  onTagClick?: (tag: string) => void
}

export function getVisibleTagCount(tagWidths: number[], availableWidth: number) {
  const allTagsWidth = tagWidths.reduce(
    (total, width, index) => total + width + (index > 0 ? TAG_GAP : 0),
    0,
  )

  if (allTagsWidth <= availableWidth) return tagWidths.length

  let usedWidth = OVERFLOW_TRIGGER_WIDTH
  let visibleCount = 0

  for (const width of tagWidths) {
    const nextWidth = usedWidth + width + TAG_GAP
    if (nextWidth > availableWidth) break
    usedWidth = nextWidth
    visibleCount += 1
  }

  return visibleCount
}

export function TaskTags({ taskId, tags, onTagClick }: TaskTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const [currentTags, setCurrentTags] = useState(tags)
  const [visibleCount, setVisibleCount] = useState(0)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setCurrentTags(tags)
  }, [tags])

  const updateVisibleCount = useCallback(() => {
    const container = containerRef.current
    const measurement = measurementRef.current
    if (!container || !measurement) return

    const tagWidths = Array.from(measurement.children).map(
      (element) => element.getBoundingClientRect().width,
    )
    setVisibleCount(getVisibleTagCount(tagWidths, container.clientWidth))
  }, [])

  useLayoutEffect(() => {
    updateVisibleCount()

    const resizeObserver = new ResizeObserver(updateVisibleCount)
    if (containerRef.current) resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [currentTags, updateVisibleCount])

  const hiddenCount = currentTags.length - visibleCount
  const canAddTag = currentTags.length < MAX_TAGS

  function handleTagClick(tag: string) {
    setTagsOpen(false)
    onTagClick?.(tag)
  }

  function handleRemoveTag(tag: string) {
    startTransition(async () => {
      const result = await removeTaskTag(taskId, tag)
      if (!result.success) {
        toast({ title: result.error, variant: "destructive" })
        return
      }
      setCurrentTags(result.data)
    })
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return

    startTransition(async () => {
      const result = await addTaskTag(taskId, tag)
      if (!result.success) {
        toast({ title: result.error, variant: "destructive" })
        return
      }

      setCurrentTags(result.data)
      setTagInput("")
      setAddOpen(false)
      toast({ title: "Tag added." })
    })
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {canAddTag && (
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                      aria-label="Add tag"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Add tag</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent align="start" className="w-64 space-y-3 p-3">
              <div>
                <p className="text-sm font-medium">Add tag</p>
                <p className="text-xs text-muted-foreground">
                  {currentTags.length} of {MAX_TAGS} tags used
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Tag name"
                  maxLength={MAX_TAG_LENGTH}
                  disabled={isPending}
                  autoFocus
                />
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isPending}
                  aria-label="Save tag"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div
          ref={containerRef}
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {currentTags.slice(0, visibleCount).map((tag) => (
            <Tag
              key={tag}
              label={tag}
              onClick={onTagClick ? (event) => { event.stopPropagation(); handleTagClick(tag) } : undefined}
              onRemove={() => handleRemoveTag(tag)}
              removePosition="corner"
              className="max-w-[110px] shrink-0"
            />
          ))}

          {hiddenCount > 0 && (
            <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-8 shrink-0 rounded-full py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Show all ${currentTags.length} tags`}
                >
                  +{hiddenCount}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 space-y-2 p-3">
                <p className="text-xs font-medium text-muted-foreground">All tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentTags.map((tag) => (
                    <Tag
                      key={tag}
                      label={tag}
                      onClick={onTagClick ? () => handleTagClick(tag) : undefined}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div
        ref={measurementRef}
        className="pointer-events-none fixed -left-[9999px] top-0 flex items-center gap-1 opacity-0"
        aria-hidden="true"
      >
        {currentTags.map((tag) => (
          <Tag key={tag} label={tag} className="max-w-[110px] shrink-0" />
        ))}
      </div>
    </>
  )
}
